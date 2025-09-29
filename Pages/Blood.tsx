import React, {
  useState,
  useMemo,
  useCallback,
  useState as useReactState,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Phone, MapPin, ChevronDown, ChevronRight } from "lucide-react-native";
import Navbar from "../Components/Navbar";
import { Header } from "../Components/Common";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import LoadingSpinner from "../Components/LoadingSpinner";
import { setBloods } from "../Redux/BloodData";
import apiClient from "../Components/Axios";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface IBloodDonor {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  phone: string;
  dateOfBirth: string;
  bloodGroup: "O+" | "O-" | "AB+" | "AB-" | "A+" | "A-" | "B+" | "B-";
  address: { 
    place: string; 
    pincode: number; 
    state: string; 
    country: string; 
    district: string;
  };
  lastDonationDate?: string | null;
  profileImage?: string;
}

const bloodGroups: (IBloodDonor["bloodGroup"] | "All")[] = [
  "All",
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
];

const calculateAge = (dob: string) => {
  const b = new Date(dob);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
};

export const getInitial = (name: string) =>
  (name?.trim()?.charAt(0) || "?").toUpperCase();

// Location hierarchy type
interface LocationHierarchy {
  country: string;
  states: {
    state: string;
    districts: {
      district: string;
      places: string[];
    }[];
  }[];
}

const BloodDonorsPage = ({ navigation }: { navigation: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<
    IBloodDonor["bloodGroup"] | "All"
  >("All");
  const [selectedLocation, setSelectedLocation] = useState({
    country: "All",
    state: "All",
    district: "All",
    place: "All"
  });
  const [loading, setLoading] = useReactState(true);
  const [refreshing, setRefreshing] = useReactState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentModalLevel, setCurrentModalLevel] = useState<'country' | 'state' | 'district' | 'place'>('country');
  const [locationHierarchy, setLocationHierarchy] = useState<LocationHierarchy[]>([]);
  const [user, setUser] = useState<any>(null);
  const [donor, setDonor] = useState<any>([]);

   const bloodData = useSelector((state: RootState) => state.bloodData);  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        var _id = await AsyncStorage.getItem("userId");
        if (!_id) return;

        const result = await apiClient.get(`/api/users/${_id}`);
        setUser(result.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const fetchDonor = async () => {
      try {
        const result = await apiClient.get(`/api/donors/users/${user._id}`);
        setDonor(result.data);
      } catch (err) {
        // console.error("Failed to fetch donor", err);
      }
    };
    fetchDonor();
  }, [user?._id, donor]);

  const dispatch = useDispatch();
  const donors = useSelector(
    (state: RootState) => state.bloodData
  ) as IBloodDonor[];

  // Build location hierarchy from donor data
  useEffect(() => {
    if (donors.length > 0) {
      const hierarchy: { [key: string]: any } = {};

      donors.forEach(donor => {
        const { country, state, district, place } = donor.address;
        
        if (!hierarchy[country]) {
          hierarchy[country] = {};
        }
        if (!hierarchy[country][state]) {
          hierarchy[country][state] = {};
        }
        if (!hierarchy[country][state][district]) {
          hierarchy[country][state][district] = new Set();
        }
        hierarchy[country][state][district].add(place);
      });

      // Convert to LocationHierarchy format
      const formattedHierarchy: LocationHierarchy[] = Object.entries(hierarchy).map(([country, states]) => ({
        country,
        states: Object.entries(states).map(([state, districts]) => ({
          state,
          districts: Object.entries(districts as any).map(([district, places]) => ({
            district,
            places: Array.from(places as Set<string>)
          }))
        }))
      }));

      setLocationHierarchy(formattedHierarchy);
    }
  }, [donors]);

  const donorsWithId: IBloodDonor[] = (donors ?? []).map((d, index) => ({
    ...d,
    id: d.id || String(index),
  }));

  const handleDonate = () =>
    user?._id ? navigation.navigate("Donate") : navigation.navigate("Login");

  const fetchDonors = async () => {
    try {
      const res = await apiClient.get("/api/donors", { withCredentials: true });
     
      dispatch(setBloods(res?.data?.donors));
    } catch (e) {
      console.error("Failed to fetch donors", e);
    }
  };

  

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        if(bloodData.length == 0) {
          setLoading(true);
          await fetchDonors();
        }
        if (mounted) setLoading(false);
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDonors();
    setRefreshing(false);
  }, []);

  const filteredDonors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return donorsWithId.filter((d) => {
      const matchesSearch =
        q.length === 0 ||
        d.userId?.name?.toLowerCase()?.includes(q) ||
        d.phone?.includes(q) ||
        d.address?.country?.toLowerCase()?.includes(q) ||
         d.address?.state?.toLowerCase()?.includes(q) ||
          d.address?.district?.toLowerCase()?.includes(q); 

      const matchesGroup =
        selectedGroup === "All" ? true : d.bloodGroup === selectedGroup;

      const matchesLocation =
        (selectedLocation.country === "All" || d.address.country === selectedLocation.country) &&
        (selectedLocation.state === "All" || d.address.state === selectedLocation.state) &&
        (selectedLocation.district === "All" || d.address.district === selectedLocation.district) &&
        (selectedLocation.place === "All" || d.address.place === selectedLocation.place);

      return matchesSearch && matchesGroup && matchesLocation;
    });
  }, [searchTerm, selectedGroup, selectedLocation, donorsWithId]);

  if (loading) return <LoadingSpinner />;

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  const getLocationButtonText = () => {
    const { country, state, district, place } = selectedLocation;
    
    if (place !== "All") return place;
    if (district !== "All") return district;
    if (state !== "All") return state;
    if (country !== "All") return country;
    return "All Locations";
  };

  const handleLocationSelect = (level: 'country' | 'state' | 'district' | 'place', value: string) => {
    const newLocation = { ...selectedLocation };
    
    if (level === 'country') {
      newLocation.country = value;
      newLocation.state = "All";
      newLocation.district = "All";
      newLocation.place = "All";
      if (value === "All") {
        setSelectedLocation(newLocation);
        setShowLocationModal(false);
        return;
      }
      setCurrentModalLevel('state');
    } else if (level === 'state') {
      newLocation.state = value;
      newLocation.district = "All";
      newLocation.place = "All";
      if (value === "All") {
        setSelectedLocation(newLocation);
        setShowLocationModal(false);
        return;
      }
      setCurrentModalLevel('district');
    } else if (level === 'district') {
      newLocation.district = value;
      newLocation.place = "All";
      if (value === "All") {
        setSelectedLocation(newLocation);
        setShowLocationModal(false);
        return;
      }
      setCurrentModalLevel('place');
    } else if (level === 'place') {
      newLocation.place = value;
      setSelectedLocation(newLocation);
      setShowLocationModal(false);
      return;
    }
    
    setSelectedLocation(newLocation);
  };

  const resetLocationFilter = () => {
    setSelectedLocation({
      country: "All",
      state: "All",
      district: "All",
      place: "All"
    });
  };

  const renderLocationItem = ({ item, level }: { item: string, level: 'country' | 'state' | 'district' | 'place' }) => {
    const isSelected = selectedLocation[level] === item;
    const displayName = item.length > 15 ? `${item.substring(0, 15)}...` : item;

    return (
      <TouchableOpacity
        onPress={() => handleLocationSelect(level, item)}
        style={[styles.locationItem, isSelected && styles.locationItemActive]}
        activeOpacity={0.7}
      >
        <Text style={[styles.locationItemText, isSelected && styles.locationItemTextActive]}>
          {displayName}
        </Text>
        {level !== 'place' && item !== "All" && (
          <ChevronRight size={16} color={isSelected ? "#FFF" : "#065F46"} />
        )}
      </TouchableOpacity>
    );
  };

  const getCurrentLevelData = () => {
    const { country, state, district } = selectedLocation;
    
    if (currentModalLevel === 'country') {
      const countries = ["All", ...locationHierarchy.map(loc => loc.country)];
      return countries;
    } else if (currentModalLevel === 'state' && country !== "All") {
      const countryData = locationHierarchy.find(loc => loc.country === country);
      const states = countryData ? ["All", ...countryData.states.map(s => s.state)] : ["All"];
      return states;
    } else if (currentModalLevel === 'district' && state !== "All") {
      const countryData = locationHierarchy.find(loc => loc.country === country);
      const stateData = countryData?.states.find(s => s.state === state);
      const districts = stateData ? ["All", ...stateData.districts.map(d => d.district)] : ["All"];
      return districts;
    } else if (currentModalLevel === 'place' && district !== "All") {
      const countryData = locationHierarchy.find(loc => loc.country === country);
      const stateData = countryData?.states.find(s => s.state === state);
      const districtData = stateData?.districts.find(d => d.district === district);
      const places = districtData ? ["All", ...districtData.places] : ["All"];
      return places;
    }
    
    return ["All"];
  };

  const getModalTitle = () => {
    const { country, state, district } = selectedLocation;
    const titles = {
      country: "Select Country",
      state: country !== "All" ? `Select State (${country})` : "Select State",
      district: state !== "All" ? `Select District (${state})` : "Select District",
      place: district !== "All" ? `Select Place (${district})` : "Select Place"
    };
    return titles[currentModalLevel];
  };

  const canGoBack = currentModalLevel !== 'country';

  const goBack = () => {
    if (currentModalLevel === 'state') setCurrentModalLevel('country');
    else if (currentModalLevel === 'district') setCurrentModalLevel('state');
    else if (currentModalLevel === 'place') setCurrentModalLevel('district');
  };

  const renderChip = ({
    item,
  }: {
    item: IBloodDonor["bloodGroup"] | "All";
  }) => {
    const active = selectedGroup === item;
    return (
      <TouchableOpacity
        onPress={() => setSelectedGroup(item)}
        style={[styles.chip, active && styles.chipActive]}
        activeOpacity={0.7}
      >
        <Text
          allowFontScaling={false}
          style={[styles.chipText, active && styles.chipTextActive]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDonor = ({ item }: { item: IBloodDonor }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text allowFontScaling={false} style={styles.avatarInitial}>
              {getInitial(item.userId.name)}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.userId.name} ({calculateAge(item.dateOfBirth)} yrs)
            </Text>
            <View style={styles.bloodBadge}>
              <Text allowFontScaling={false} style={styles.bloodBadgeText}>
                {item.bloodGroup}
              </Text>
            </View>
          </View>
          <View style={styles.locationInfo}>
            <MapPin size={12} color="#616161" />
            <Text style={styles.info} >
              {item.address.place} {" "} {item.address.district} {" "} {item.address.state} {" "}{item.address.country}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => handleCall(item.phone)}
          >
            <Phone size={16} color="#FFF" />
            <Text style={styles.callBtnText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Navbar />
      <Header
        onBackClick={() => navigation.navigate("Home")}
        title="Blood Services"
      />

      <View style={styles.searchBar}>
        <Icon
          name="search"
          size={18}
          color="#388E3C"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.searchInput, { marginRight: 8 }]}
          placeholder="Search donors..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
        />
        {!donor?._id && (
          <TouchableOpacity style={styles.donateBtn} onPress={handleDonate}>
            <Text style={styles.donateBtnText}>Donate</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Location Filter Button */}
      <View style={styles.locationFilterContainer}>
        <TouchableOpacity
          style={styles.locationFilterButton}
          onPress={() => {
            setShowLocationModal(true);
            setCurrentModalLevel('country');
          }}
        >
          <MapPin size={16} color="#FFF" />
          <Text style={styles.locationFilterButtonText}>
            {getLocationButtonText()}
          </Text>
          <ChevronDown size={14} color="#FFF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
        
        {(selectedLocation.country !== "All" || selectedLocation.state !== "All" || 
          selectedLocation.district !== "All" || selectedLocation.place !== "All") && (
          <TouchableOpacity style={styles.resetLocationButton} onPress={resetLocationFilter}>
            <Text style={styles.resetLocationButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Location Selection Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {canGoBack && (
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                  <ChevronRight size={20} color="#065F46" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
              )}
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowLocationModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={getCurrentLevelData()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderLocationItem({ item, level: currentModalLevel })}
              contentContainerStyle={styles.modalList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.chipsContainer}>
        <FlatList
          horizontal
          data={bloodGroups}
          keyExtractor={(g) => g}
          renderItem={renderChip}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        />
      </View>

      {filteredDonors.length > 0 ? (
        <FlatList
          data={filteredDonors}
          keyExtractor={(item) => item.id}
          renderItem={renderDonor}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.donorsList}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.empty}>No donors found.</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default BloodDonorsPage;

const GREEN = "#388E3C";
const GREEN_DARK = "#2E7D32";
const BLUE = "#1976D2";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
    marginHorizontal: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
  },
  donateBtn: {
    backgroundColor: GREEN,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  donateBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  locationFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 12,
  },
  locationFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#66BB6A",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
  },
  locationFilterButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  resetLocationButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  resetLocationButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
  chipsContainer: {
    height: 70,
  },
  chipsRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chip: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: GREEN,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
  },
  chipActive: {
    backgroundColor: GREEN_DARK,
    borderColor: GREEN_DARK,
  },
  chipText: {
    color: GREEN,
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  chipTextActive: {
    color: "#FFF",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    marginHorizontal: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#A5D6A7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarInitial: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    color: GREEN,
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  info: {
    color: "#616161",
    fontSize: 14,
    marginLeft: 4,
  },
  bloodBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
  },
  bloodBadgeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  callBtnText: {
    color: "#FFF",
    marginLeft: 6,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },
  empty: {
    textAlign: "center",
    color: "#616161",
    fontSize: 16,
  },
  donorsList: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#065F46",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#065F46",
    fontWeight: "bold",
  },
  modalList: {
    paddingBottom: 16,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  locationItemActive: {
    backgroundColor: "#66BB6A",
    borderRadius: 8,
    marginVertical: 2,
  },
  locationItemText: {
    fontSize: 16,
    color: "#065F46",
    fontWeight: "500",
  },
  locationItemTextActive: {
    color: "#FFF",
  },
});