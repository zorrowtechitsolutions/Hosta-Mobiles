// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Switch,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { Feather } from "@expo/vector-icons";
// import { Hospital, WorkingHours } from "../Redux/HospitalsData";
// import { RootState } from "../Redux/Store";
// import { FormInput, Header } from "../Components/Common";
// import LoadingSpinner from "../Components/LoadingSpinner";
// import Navbar from "../Components/Navbar";
// import { ScrollView } from "react-native-gesture-handler";

// export default function HospitalsPage({
//   route,
//   navigation,
// }: {
//   route: any;
//   navigation: any;
// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterOpenNow, setFilterOpenNow] = useState(false);

//   const { hospitals = [] } = useSelector(
//     (state: RootState) => state.hospitalData
//   );
//   const { latitude, longitude } = useSelector(
//     (state: RootState) => state.userLogin
//   );

//   const HospitalsType = route.params?.type || "";

//   const calculateDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ): number => {
//     const R = 6371;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const isOpenNow = (workingHours: WorkingHours[]) => {
//     const now = new Date();

//     const currentDay = now
//       .toLocaleString("en-US", {
//         weekday: "long",
//         timeZone: "Asia/Kolkata",
//       })
//       .toString()
//       .split(" ")[0];
//     const Time = now
//       .toLocaleString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//         timeZone: "Asia/Kolkata",
//       })
//       .toString();
//     const match = Time.match(/\b\d{2}:\d{2}\b/);
//     const currentTime = match ? match[0] : null;

  

//     const todayHours = workingHours.find(
//       (wh) => wh.day.toLowerCase().slice(0, 3) == currentDay.toLowerCase()
//     );

//     if (
//       !todayHours ||
//       todayHours.is_holiday ||
//       !todayHours.opening_time ||
//       !todayHours.closing_time
//     ) {
//       return false;
//     }

//     const { opening_time, closing_time } = todayHours;


//     const currentTimeMinutes = parseTimeToMinutes(currentTime as string);
//     const openingTimeMinutes = parseTimeToMinutes(opening_time);
//     const closingTimeMinutes = parseTimeToMinutes(closing_time);

//     const isOpen =
//       currentTimeMinutes >= openingTimeMinutes &&
//       currentTimeMinutes <= closingTimeMinutes;

//     return isOpen;
//   };

//   const parseTimeToMinutes = (time: string): number => {
//     const [hours, minutes] = time.split(":").map(Number);
//     return hours * 60 + minutes;
//   };

//   if (hospitals.length === 0) {
//     return <LoadingSpinner />;
//   }

//   const filteredAndSortedHospitals = hospitals
//     .filter(
//       (hospital: Hospital) =>
//         hospital?.type?.toLowerCase() === HospitalsType?.toLowerCase() &&
//         (hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           hospital.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
//         (!filterOpenNow || isOpenNow(hospital.working_hours))
//     )
//     .sort((a: Hospital, b: Hospital) => {
//       const distanceA = calculateDistance(
//         latitude as number,
//         longitude as number,
//         a.latitude as number,
//         a.longitude as number
//       );
//       const distanceB = calculateDistance(
//         latitude as number,
//         longitude as number,
//         b.latitude as number,
//         b.longitude as number
//       );
//       return distanceA - distanceB;
//     });

//   const renderHospitalItem = ({ item }: { item: Hospital }) => (
//     <TouchableOpacity
//       style={styles.hospitalCard}
//       onPress={() => navigation.navigate("HospitalDetails", { id: item._id })}
//     >
//       <Image
//         source={{
//           uri: item?.image?.imageUrl || "https://via.placeholder.com/300x200",
//         }}
//         style={styles.hospitalImage}
//       />
//       <Text style={styles.hospitalName}>{item.name}</Text>
//       <View style={styles.ratingContainer}>
//         <Feather name="star" size={16} color="#4CAF50" />
//         <Text style={styles.ratingText}>
//           {item?.reviews && item.reviews.length > 0
//             ? (
//                 (item.reviews.reduce((sum, review) => sum + review.rating, 0) /
//                   (item.reviews.length * 5)) *
//                 5
//               ).toFixed(1)
//             : "0"}
//           /5
//         </Text>
//       </View>
//       <View style={styles.infoContainer}>
//         <Feather name="clock" size={16} color="#4CAF50" />
//         <Text style={styles.infoText}>
//           {isOpenNow(item.working_hours) ? "Open now" : "Closed"}
//         </Text>
//       </View>
//       <View style={styles.infoContainer}>
//         <Feather name="phone" size={16} color="#4CAF50" />
//         <Text style={styles.infoText}>{item.phone}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Navbar />
//       {/* <Text>{`${currentDay},time:${currentTime},todays:${todayHours?.opening_time},${todayHours?.opening_time}`}</Text> */}
//       <ScrollView>
//         <Header
//           onBackClick={() => navigation.navigate("HostpitalTypes")}
//           title="Hospitals"
//         />
//         <View style={styles.searchContainer}>
//           <FormInput
//             placeholder="Search hospitals..."
//             value={searchTerm}
//             OnChange={setSearchTerm}
//             className={styles.searchInput}
//             type="Search"
//           />
//           <Feather
//             name="search"
//             size={20}
//             color="#4CAF50"
//             style={styles.searchIcon}
//           />
//         </View>
//         <View style={styles.filterContainer}>
//           <Text style={styles.filterText}>Open Now</Text>
//           <Switch
//             value={filterOpenNow}
//             onValueChange={setFilterOpenNow}
//             trackColor={{ false: "#ffffff", true: "#38a169" }}
//             thumbColor={filterOpenNow ? "#38a169" : "#38a169"}
//           />
//         </View>
//         <View>
//           {filteredAndSortedHospitals.map((hospital: Hospital) => (
//             <View style={styles.listContainer} key={hospital._id}>
//               {renderHospitalItem({ item: hospital })}
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ECFDF5",
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 16,
//     marginVertical: 8,
//   },
//   searchInput: {
//     flex: 1,
//     paddingLeft: 40,
//     backgroundColor: "#ffffff",
//   },
//   searchIcon: {
//     position: "absolute",
//     left: 10,
//   },
//   filterContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     marginHorizontal: 16,
//     marginBottom: 8,
//   },
//   filterText: {
//     marginRight: 8,
//     color: "#4CAF50",
//   },
//   listContainer: {
//     padding: 16,
//   },
//   hospitalCard: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 0.2,
//     elevation: 1,
//   },
//   hospitalImage: {
//     width: "100%",
//     height: 150,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   hospitalName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1B5E20",
//     marginBottom: 4,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   ratingText: {
//     marginLeft: 4,
//     color: "#4CAF50",
//   },
//   infoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 4,
//   },
//   infoText: {
//     marginLeft: 4,
//     color: "#4CAF50",
//   },
// });


import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Hospital, WorkingHours, setHospitalData } from "../Redux/HospitalsData";
import { RootState } from "../Redux/Store";
import { FormInput, Header } from "../Components/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import Navbar from "../Components/Navbar";
import { apiClient } from "../Components/Axios";
import { getCurrentLocation } from "../Components/GetCurrentLocation";
import { updateUserData } from "../Redux/UserData";


export default function HospitalsPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  const dispatch = useDispatch();
  const { hospitals = [] } = useSelector(
    (state: RootState) => state.hospitalData
  );
  const { latitude, longitude, ...userData } = useSelector(
    (state: RootState) => state.userLogin
  );

  const hospitalType = route.params?.type || "";

  // Fetch hospitals if not in Redux
  useEffect(() => {
    const fetchHospitals = async () => {
      if (hospitals.length === 0) {
        setLoading(true);
        try {
          const result = await apiClient.get("/api/hospitals");
          dispatch(setHospitalData({ data: result.data.data }));
        } catch (err) {
          console.error(err);
          Alert.alert("Error", "Failed to fetch hospitals");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, [dispatch, hospitals.length]);

  // Fetch location if sort by distance is enabled and no location
  useEffect(() => {
    if (sortByDistance && (!latitude || !longitude)) {
      setLocationLoading(true);
      getCurrentLocation()
        .then(([lat , lon] : any) => {
          dispatch(
            updateUserData({ ...userData, latitude: lat, longitude: lon })
          );
        })
        .catch((err: any) => {
          console.error("Failed to get location", err);
          Alert.alert("Location Error", "Failed to get your current location");
        })
        .finally(() => setLocationLoading(false));
    }
  }, [sortByDistance, latitude, longitude, dispatch, userData]);

  // Calculate distance in km
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

   const isOpenNow = (workingHours: WorkingHours[]) => {
    const now = new Date();
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });
    const currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const todayHours = workingHours.find((wh: any) => wh.day === currentDay);
    if (
      !todayHours ||
      todayHours.is_holiday ||
      !todayHours.opening_time ||
      !todayHours.closing_time
    )
      return false;

    return (
      currentTime >= todayHours.opening_time &&
      currentTime <= todayHours.closing_time
    );
  };


  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Filter hospitals using useMemo for performance
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(
      (hospital: Hospital) =>
        hospital?.type?.toLowerCase() === hospitalType?.toLowerCase() &&
        (hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterOpenNow || isOpenNow(hospital.working_hours))
    );
  }, [hospitals, hospitalType, searchTerm, filterOpenNow]);

  // Sort hospitals using useMemo for performance
  const sortedHospitals = useMemo(() => {
    let hospitalsToSort = [...filteredHospitals];

    if (sortByDistance && latitude && longitude) {
      return hospitalsToSort.sort((a, b) => {
        const distanceA = calculateDistance(
          latitude,
          longitude,
          a.latitude as number,
          a.longitude as number
        );
        const distanceB = calculateDistance(
          latitude,
          longitude,
          b.latitude as number,
          b.longitude as number
        );
        return distanceA - distanceB;
      });
    }

    return hospitalsToSort.sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredHospitals, sortByDistance, latitude, longitude]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderHospitalItem = (hospital: Hospital & { distance?: number }) => {
    const distance = latitude && longitude 
      ? calculateDistance(
          latitude,
          longitude,
          hospital.latitude as number,
          hospital.longitude as number
        )
      : undefined;

    return (
      <TouchableOpacity
        key={hospital._id}
        style={styles.hospitalCard}
        onPress={() => navigation.navigate("HospitalDetails", { id: hospital._id })}
      >
        <Image
          source={{
            uri: hospital?.image?.imageUrl || "https://via.placeholder.com/300x200",
          }}
          style={styles.hospitalImage}
        />
        
        <Text style={styles.hospitalName}>{hospital.name}</Text>

        {/* Rating */}
        <View style={styles.infoRow}>
          <Feather name="star" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>
            {hospital?.reviews && hospital.reviews.length > 0
              ? (
                  hospital.reviews.reduce((sum, review) => sum + review.rating, 0) /
                  hospital.reviews.length
                ).toFixed(1)
              : "0"}
            /5
          </Text>
        </View>

        {/* Open Status */}
        <View style={styles.infoRow}>
          <Feather name="clock" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>
            {isOpenNow(hospital.working_hours) ? (
              <Text style={styles.openText}>Open now</Text>
            ) : (
              "Closed"
            )}
          </Text>
        </View>

        {/* Phone */}
        <View style={styles.infoRow}>
          <Feather name="phone" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>{hospital.phone}</Text>
        </View>

        {/* Distance */}
        {sortByDistance && distance !== undefined && (
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>
              {distance.toFixed(2)} km away
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Header
           onBackClick={() => navigation.navigate("HostpitalTypes")}
          title="Hospitals"
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <FormInput
              placeholder="Search hospitals..."
              value={searchTerm}
              OnChange={setSearchTerm}
              // style={styles.searchInput}
               className={styles.searchInput}
              type="text"
            />
            <Feather
              name="search"
              size={20}
              color="#4CAF50"
              style={styles.searchIcon}
            />
          </View>
        </View>

        {/* Filters Section */}
        <View style={styles.filtersContainer}>
          {/* Open Now Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Open Now</Text>
            <Switch
              value={filterOpenNow}
              onValueChange={setFilterOpenNow}
              trackColor={{ false: "#767577", true: "#81c995" }}
              thumbColor={filterOpenNow ? "#4CAF50" : "#f4f3f4"}
            />

                <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Sort by Nearest</Text>
              <Switch
                value={sortByDistance}
                onValueChange={setSortByDistance}
                trackColor={{ false: "#767577", true: "#81c995" }}
                thumbColor={sortByDistance ? "#4CAF50" : "#f4f3f4"}
                disabled={locationLoading}
              />
            
            {/* Location Loading Indicator */}
            {(locationLoading || (!latitude && !longitude && sortByDistance)) && (
              <View style={styles.locationLoadingContainer}>
                <ActivityIndicator size="small" color="#4CAF50" />
                <Text style={styles.locationLoadingText}>
                  Getting your current location...
                </Text>
              </View>
            )}
          </View>
          </View>

          {/* Sort by Distance Filter */}
      
        </View>

        {/* Hospital Grid */}
        <View style={styles.hospitalsGrid}>
          {sortedHospitals.map((hospital) => renderHospitalItem(hospital))}
        </View>

        {sortedHospitals.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No hospitals found matching your criteria
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4", // green-50 equivalent
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  searchInputContainer: {
    position: "relative",
  },
  searchInput: {
    paddingLeft: 40,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 9,
    zIndex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 1,
    // paddingVertical: 8,
  },
  distanceFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginRight: 12,
  },
  locationLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "stretch",
  },
  locationLoadingText: {
    color: "#dc2626",
    fontSize: 14,
    marginLeft: 8,
  },
  hospitalsGrid: {
    paddingHorizontal: 16,
  },
  hospitalCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hospitalImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontSize: 14,
  },
  openText: {
    fontStyle: "italic",
    color: "#4CAF50",
  },
  distanceContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  distanceText: {
    fontSize: 14,
    color: "#1B5E20",
    fontWeight: "500",
  },
  noResultsContainer: {
    padding: 32,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
});