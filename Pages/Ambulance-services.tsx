import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { Header } from "../Components/Common";
import Navbar from "../Components/Navbar";
import {  Phone } from "lucide-react-native";
import { Feather } from "@expo/vector-icons";
import LoadingSpinner from "../Components/LoadingSpinner";

const AmbulanceServicesPage = ({ navigation }: { navigation: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const AmbulanceServices = useSelector(
    (state: RootState) => state.ambulanceData
  );
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.userLogin
  ) as { latitude: number; longitude: number };
  const [filteredServices, setFilteredServices] = useState(AmbulanceServices);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setUserLocation({ latitude, longitude });
      // Simulate loading time for better UX
      setTimeout(() => setIsLoading(false), 1000);
    } catch (error) {
      console.error("Error getting user location:", error);
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // Filter and sort services based on search term and location
    let filtered = AmbulanceServices;
    
    if (searchTerm) {
      filtered = AmbulanceServices.filter(
        (service) =>
          service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const sortedAndFiltered = sortServices(filtered);
    setFilteredServices(sortedAndFiltered);
  }, [searchTerm, sortOrder, userLocation, AmbulanceServices]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortServices = (services: typeof AmbulanceServices) => {
    if (!userLocation) return services;
    
    return [...services].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        Number(a.latitude) || 0,
        Number(a.longitude) || 0
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        Number(b.latitude) || 0,
        Number(b.longitude) || 0
      );
      return sortOrder === "asc"
        ? distanceA - distanceB
        : distanceB - distanceA;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleCall = (phone: string) => {
    if (!phone) {
      Alert.alert("Error", "Phone number not available");
      return;
    }
    
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  const renderService = ({ item }: { item: (typeof AmbulanceServices)[0] }) => {
    const distance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          Number(item.latitude) || 0,
          Number(item.longitude) || 0
        )
      : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.iconWrapper}>
            <Icon name="ambulance" size={24} color="#388E3C" />
          </View>
          <View style={styles.details}>
            <Text style={styles.serviceName}>
              {item.serviceName || "Unknown Service"}
            </Text>
            <Text style={styles.address}>
              <Icon name="map-marker-alt" size={14} color="#616161" />{" "}
              {item.address || "Address not available"}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.callButton,
                  !item.phone && styles.callButtonDisabled
                ]}
                onPress={() => handleCall(item.phone)}
                disabled={!item.phone}
              >
                <Phone size={16} color="#FFF" />
                <Text style={styles.callButtonText}>
                  {item.phone ? "Call Now" : "No Phone"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.distance}>
                {distance !== null
                  ? `${distance.toFixed(2)} km away`
                  : "Distance unknown"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Show loading spinner while initializing
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <Header
        onBackClick={() => navigation.navigate("Home")}
        title="Ambulance Services"
      />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
      
             <Feather
              name="search"
              size={20}
              color="#4CAF50"
              style={styles.searchIcon}
            />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ambulance services..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {AmbulanceServices.length > 0 && (
          <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
            <Text style={styles.sortText}>
              Sort by Distance ({sortOrder === "asc" ? "Nearest" : "Farthest"}){" "}
              <Icon name="sort" size={16} />
            </Text>
          </TouchableOpacity>
        )}

        {filteredServices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="ambulance" size={64} color="#9E9E9E" />
            <Text style={styles.emptyTitle}>No ambulance services found</Text>
            <Text style={styles.emptyMessage}>
              {searchTerm
                ? `No services found for "${searchTerm}". Try a different search term.`
                : "No ambulance services are currently available."}
            </Text>
            {searchTerm && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchTerm("")}
              >
                <Text style={styles.clearButtonText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredServices}
            keyExtractor={(item : any, index : any) => item.id || `ambulance-${index}`}
            renderItem={renderService}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default AmbulanceServicesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sortButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
    padding: 8,
  },
  sortText: {
    fontSize: 14,
    color: "#388E3C",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
  },
  iconWrapper: {
    backgroundColor: "#C8E6C9",
    padding: 12,
    borderRadius: 10,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  details: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 4,
  },
  address: {
    color: "#616161",
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#388E3C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  callButtonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  callButtonText: {
    color: "#FFF",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  distance: {
    color: "#616161",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#616161",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#9E9E9E",
    textAlign: "center",
    lineHeight: 22,
  },
  clearButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#388E3C",
    borderRadius: 25,
  },
  clearButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});