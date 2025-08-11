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
import { Phone } from "lucide-react-native";
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

  useEffect(() => {
    try {
      setUserLocation({ latitude, longitude });
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  }, []);

  useEffect(() => {
    // Filter and sort services based on search term and location
    const filtered = AmbulanceServices.filter(
      (service) =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sortedAndFiltered = sortServices(filtered);
    setFilteredServices(sortedAndFiltered);
  }, [searchTerm, sortOrder, userLocation]);

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

  if (AmbulanceServices.length === 0) {
    return <LoadingSpinner />;
  }

  const sortServices = (services: typeof AmbulanceServices) => {
    return services.sort((a, b) => {
      if (!userLocation) return 0;
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        Number(a.latitude),
        Number(a.longitude)
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        Number(b.latitude),
        Number(b.longitude)
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
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  const renderService = ({ item }: { item: (typeof AmbulanceServices)[0] }) => {
    const distance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          Number(item.latitude),
          Number(item.longitude)
        )
      : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.iconWrapper}>
            <Icon name="ambulance" size={24} color="#388E3C" />
          </View>
          <View style={styles.details}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <Text style={styles.address}>
              <Icon name="map-marker-alt" size={14} color="#616161" />{" "}
              {item.address}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(item.phone)}
              >
                <Phone size={16} color="#FFF" />
                <Text style={styles.callButtonText}>Call Now</Text>
              </TouchableOpacity>
              <Text style={styles.distance}>
                {distance !== null
                  ? `${distance.toFixed(2)} km away`
                  : "Calculating..."}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Header
        onBackClick={() => navigation.navigate("Home")}
        title="Ambulance Services"
      />

      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={18}
            color="#388E3C"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ambulance services..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Text style={styles.sortText}>
            Sort by Distance <Icon name="sort" size={16} />
          </Text>
        </TouchableOpacity>

        <FlatList
          data={filteredServices}
          // keyExtractor={(item) => item.id}
          renderItem={renderService}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No services found.</Text>
          }
        />
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  sortButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  sortText: {
    fontSize: 14,
    color: "#388E3C",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
  },
  iconWrapper: {
    backgroundColor: "#C8E6C9",
    padding: 12,
    borderRadius: 10,
    marginRight: 16,
    display: "flex",
    justifyContent: "center",
  },
  details: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C",
  },
  address: {
    color: "#616161",
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#388E3C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 25,
  },
  callButtonText: {
    color: "#FFF",
    marginLeft: 6,
  },
  distance: {
    color: "#616161",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#616161",
    marginTop: 20,
  },
});
