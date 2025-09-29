// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// // } from "react-native";
// // import Icon from "react-native-vector-icons/FontAwesome";
// // import { Hospital, Review } from "../Redux/HospitalsData";
// // import { useSelector } from "react-redux";
// // import { RootState } from "../Redux/Store";
// // import Navbar from "../Components/Navbar";
// // import { Header } from "../Components/Common";
// // import LoadingSpinner from "../Components/LoadingSpinner";

// // interface HospitalDetails {
// //   id: string;
// //   name: string;
// //   rating: number;
// //   doctorCount: number;
// //   location: string;
// // }

// // interface SpecialtyWithHospitals {
// //   id?: string;
// //   name: string;
// //   description: string;
// //   hospitals: HospitalDetails[];
// // }

// // // Function to gather specialties with associated hospitals
// // const getAllSpecialtiesWithHospitals = (
// //   hospitals: Hospital[]
// // ): SpecialtyWithHospitals[] => {
// //   const specialtiesMap: { [key: string]: SpecialtyWithHospitals } = {};

// //   hospitals.forEach((hospital) => {
// //     hospital.specialties.forEach((specialty) => {
// //       if (!specialtiesMap[specialty.name]) {
// //         specialtiesMap[specialty.name] = {
// //           id: specialty._id,
// //           name: specialty.name,
// //           description: specialty.description,
// //           hospitals: [],
// //         };
// //       }

// //       specialtiesMap[specialty.name].hospitals.push({
// //         id: hospital._id ?? "",
// //         name: hospital.name,
// //         rating: calculateAverageRating(hospital.reviews),
// //         doctorCount: specialty.doctors.length,
// //         location: hospital.address,
// //       });
// //     });
// //   });

// //   return Object.values(specialtiesMap);
// // };

// // const calculateAverageRating = (reviews: Review[]): number => {
// //   if (reviews.length === 0) return 0;
// //   const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
// //   return totalRating / reviews.length;
// // };

// // const SpecialtiesPage = ({ navigation }: { navigation: any }) => {
// //   const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(
// //     null
// //   );
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const hospitals = useSelector(
// //     (state: RootState) => state.hospitalData.hospitals
// //   );

// //   const specialties = getAllSpecialtiesWithHospitals(hospitals);
// //   const [filteredSpecialties, setFilteredSpecialties] =
// //     useState<SpecialtyWithHospitals[]>(specialties);

// //   useEffect(() => {
// //     const filtered = specialties.filter(
// //       (specialty) =>
// //         specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
// //     );
// //     setFilteredSpecialties(filtered);
// //   }, [searchTerm]);

// //   const toggleSpecialtyExpansion = (specialtyId: string) => {
// //     setExpandedSpecialty(
// //       expandedSpecialty === specialtyId ? null : specialtyId
// //     );
// //   };

// //   const navigateToHospital = (hospitalId: string) => {
// //     navigation.navigate("HospitalDetails", { id: hospitalId });
// //   };

// //   if (hospitals.length === 0) {
// //     return <LoadingSpinner />;
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <Navbar />
// //       <Header
// //         onBackClick={() => {
// //           navigation.navigate("Home");
// //         }}
// //         title="Medical Specialties"
// //       />
// //       <View style={{ padding: 16 }}>
// //         <View style={styles.searchContainer}>
// //           <Icon
// //             name="search"
// //             size={20}
// //             color="#4CAF50"
// //             style={styles.searchIcon}
// //           />
// //           <TextInput
// //             style={styles.searchInput}
// //             placeholder="Search specialties..."
// //             value={searchTerm}
// //             onChangeText={setSearchTerm}
// //           />
// //         </View>

// //         <FlatList
// //           data={filteredSpecialties}
// //           keyExtractor={(item) => item.id!}
// //           renderItem={({ item }) => (
// //             <View style={styles.specialtyCard}>
// //               <TouchableOpacity
// //                 style={styles.specialtyHeader}
// //                 onPress={() => toggleSpecialtyExpansion(item.id!)}
// //               >
// //                 <Text style={styles.specialtyName}>{item.name}</Text>
// //                 <Icon
// //                   name={
// //                     expandedSpecialty === item.id
// //                       ? "chevron-up"
// //                       : "chevron-down"
// //                   }
// //                   size={20}
// //                   color="#4CAF50"
// //                 />
// //               </TouchableOpacity>
// //               {expandedSpecialty === item.id && (
// //                 <View style={styles.hospitalList}>
// //                   <Text style={styles.hospitalListTitle}>
// //                     Hospitals with {item.name}
// //                   </Text>
// //                   {item.hospitals.map((hospital) => (
// //                     <TouchableOpacity
// //                       key={hospital.id}
// //                       style={styles.hospitalCard}
// //                       onPress={() => navigateToHospital(hospital.id)}
// //                     >
// //                       <Text style={styles.hospitalName}>{hospital.name}</Text>
// //                       <View style={styles.hospitalDetails}>
// //                         <Icon
// //                           name="star"
// //                           size={14}
// //                           color="#FFC107"
// //                           style={styles.hospitalIcon}
// //                         />
// //                         <Text>{hospital.rating.toFixed(1)}</Text>
// //                       </View>
// //                       <View style={styles.hospitalDetails}>
// //                         <Icon
// //                           name="map-marker"
// //                           size={14}
// //                           color="#4CAF50"
// //                           style={styles.hospitalIcon}
// //                         />
// //                         <Text>{hospital.location}</Text>
// //                       </View>
// //                       <Text style={styles.doctorCount}>
// //                         {hospital.doctorCount} doctors
// //                       </Text>
// //                     </TouchableOpacity>
// //                   ))}
// //                 </View>
// //               )}
// //             </View>
// //           )}
// //           ListEmptyComponent={
// //             <Text style={styles.emptyMessage}>
// //               No specialties found matching your search criteria.
// //             </Text>
// //           }
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // export default SpecialtiesPage;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#ECFDF5",
// //     // padding: 16,
// //   },
// //   header: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     color: "#388E3C",
// //     marginBottom: 16,
// //     textAlign: "center",
// //   },
// //   searchContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#FFF",
// //     borderRadius: 25,
// //     paddingHorizontal: 16,
// //     marginBottom: 16,
// //     elevation: 2,
// //   },
// //   searchIcon: {
// //     marginRight: 8,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     height: 40,
// //   },
// //   specialtyCard: {
// //     backgroundColor: "#FFF",
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     padding: 16,
// //     elevation: 2,
// //   },
// //   specialtyHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   specialtyName: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     color: "#388E3C",
// //   },
// //   hospitalList: {
// //     marginTop: 16,
// //   },
// //   hospitalListTitle: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     color: "#4CAF50",
// //     marginBottom: 8,
// //   },
// //   hospitalCard: {
// //     backgroundColor: "#F1F8E9",
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 8,
// //   },
// //   hospitalName: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     color: "#2E7D32",
// //   },
// //   hospitalDetails: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginTop: 4,
// //   },
// //   hospitalIcon: {
// //     marginRight: 4,
// //   },
// //   doctorCount: {
// //     marginTop: 4,
// //     color: "#616161",
// //   },
// //   emptyMessage: {
// //     textAlign: "center",
// //     color: "#616161",
// //     marginTop: 20,
// //   },
// // });



// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Modal,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import { Feather } from "@expo/vector-icons";
// import { Hospital, Review } from "../Redux/HospitalsData";
// import { useSelector } from "react-redux";
// import { RootState } from "../Redux/Store";
// import Navbar from "../Components/Navbar";
// import { Header } from "../Components/Common";
// import LoadingSpinner from "../Components/LoadingSpinner";

// interface HospitalDetails {
//   id: string;
//   name: string;
//   rating: number;
//   doctorCount: number;
//   location: string;
// }

// interface SpecialtyWithHospitals {
//   id?: string;
//   name: string;
//   description: string;
//   hospitals: HospitalDetails[];
// }

// // SVG-like illustrations using emojis (you can replace with actual SVG components)
// const specialtyIllustrations: { [key: string]: string } = {
//   Cardiology: "❤️",
//   Neurology: "🧠",
//   Orthopedics: "🦴",
//   Ophthalmology: "👁️",
//   General: "🏥",
//   Default: "⭐",
// };

// // Function to gather specialties with associated hospitals
// const getAllSpecialtiesWithHospitals = (
//   hospitals: Hospital[]
// ): SpecialtyWithHospitals[] => {
//   const specialtiesMap: { [key: string]: SpecialtyWithHospitals } = {};

//   hospitals.forEach((hospital) => {
//     hospital.specialties.forEach((specialty) => {
//       if (!specialtiesMap[specialty.name]) {
//         specialtiesMap[specialty.name] = {
//           id: specialty._id,
//           name: specialty.name,
//           description: specialty.description || "No description provided.",
//           hospitals: [],
//         };
//       }

//       specialtiesMap[specialty.name].hospitals.push({
//         id: hospital._id ?? "",
//         name: hospital.name,
//         rating: calculateAverageRating(hospital.reviews),
//         doctorCount: specialty.doctors.length,
//         location: hospital.address,
//       });
//     });
//   });

//   return Object.values(specialtiesMap);
// };

// const calculateAverageRating = (reviews: Review[]): number => {
//   if (!reviews || reviews.length === 0) return 0;
//   const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//   return totalRating / reviews.length;
// };

// const SpecialtiesPage = ({ navigation }: { navigation: any }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyWithHospitals | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const hospitals = useSelector(
//     (state: RootState) => state.hospitalData.hospitals
//   );

//   const specialties = getAllSpecialtiesWithHospitals(hospitals);
//   const [filteredSpecialties, setFilteredSpecialties] =
//     useState<SpecialtyWithHospitals[]>(specialties);

//   useEffect(() => {
//     const filtered = specialties.filter(
//       (specialty) =>
//         specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredSpecialties(filtered);
//   }, [searchTerm, specialties]);

//   const handleSpecialtyPress = (specialty: SpecialtyWithHospitals) => {
//     setSelectedSpecialty(specialty);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedSpecialty(null);
//   };

//   const navigateToHospital = (hospitalId: string) => {
//     setModalVisible(false);
//     navigation.navigate("HospitalDetails", { id: hospitalId });
//   };

//   if (hospitals.length === 0) {
//     return <LoadingSpinner />;
//   }

//   const renderSpecialtyCard = ({ item }: { item: SpecialtyWithHospitals }) => (
//     <TouchableOpacity
//       style={styles.specialtyCard}
//       onPress={() => handleSpecialtyPress(item)}
//     >
//       <Text style={styles.specialtyIcon}>
//         {specialtyIllustrations[item.name] || specialtyIllustrations.Default}
//       </Text>
//       <Text style={styles.specialtyName} numberOfLines={1}>
//         {item.name}
//       </Text>
//       <Text style={styles.specialtyDescription} numberOfLines={3}>
//         {item.description}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderHospitalItem = ({ item }: { item: HospitalDetails }) => (
//     <TouchableOpacity
//       style={styles.hospitalCard}
//       onPress={() => navigateToHospital(item.id)}
//     >
//       <Text style={styles.hospitalName} numberOfLines={1}>{item.name}</Text>
//       <View style={styles.hospitalDetails}>
//         <View style={styles.detailRow}>
//           <Feather name="star" size={16} color="#FFD700" />
//           <Text style={styles.detailText}>{item.rating.toFixed(1)}</Text>
//         </View>
//         <View style={styles.detailRow}>
//           <Feather name="map-pin" size={16} color="#4CAF50" />
//           <Text style={styles.detailText} numberOfLines={1}>{item.location}</Text>
//         </View>
//         <Text style={styles.doctorCount}>
//           {item.doctorCount} doctor{item.doctorCount > 1 ? "s" : ""}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Navbar />
      
//       <View style={styles.content}>
//         <Header
//           onBackClick={() => navigation.goBack()}
//           title="Medical Specialties"
//         />

//         {/* Search Bar */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchInputContainer}>
//             <Feather
//               name="search"
//               size={20}
//               color="#4CAF50"
//               style={styles.searchIcon}
//             />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search specialties..."
//               value={searchTerm}
//               onChangeText={setSearchTerm}
//             />
//           </View>
//         </View>

//         {/* Specialties Grid */}
//         {filteredSpecialties.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyText}>No specialties found.</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={filteredSpecialties}
//             keyExtractor={(item) => item.id!}
//             renderItem={renderSpecialtyCard}
//             numColumns={2}
//             columnWrapperStyle={styles.columnWrapper}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.gridContainer}
//           />
//         )}
//       </View>

//       {/* Modal for Hospital List */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>
//                 {selectedSpecialty?.name} Hospitals
//               </Text>
//               <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
//                 <Feather name="x" size={24} color="#4CAF50" />
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={selectedSpecialty?.hospitals || []}
//               keyExtractor={(item) => item.id}
//               renderItem={renderHospitalItem}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.hospitalList}
//               ListEmptyComponent={
//                 <Text style={styles.emptyHospitalText}>
//                   No hospitals found for this specialty.
//                 </Text>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 48) / 2; // 16px padding on each side + 16px gap

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0fdf4", // green-50 equivalent
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   searchContainer: {
//     marginBottom: 20,
//   },
//   searchInputContainer: {
//     position: "relative",
//   },
//   searchInput: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     paddingHorizontal: 44,
//     paddingVertical: 12,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: "#bbf7d0", // green-200 equivalent
//   },
//   searchIcon: {
//     position: "absolute",
//     left: 12,
//     top: 12,
//     zIndex: 1,
//   },
//   gridContainer: {
//     paddingBottom: 20,
//   },
//   columnWrapper: {
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   specialtyCard: {
//     width: CARD_WIDTH,
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 16,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   specialtyIcon: {
//     fontSize: 40,
//     marginBottom: 12,
//   },
//   specialtyName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1B5E20",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   specialtyDescription: {
//     fontSize: 12,
//     color: "#4CAF50",
//     textAlign: "center",
//     lineHeight: 16,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#4CAF50",
//     textAlign: "center",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   modalContent: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 20,
//     width: "100%",
//     maxHeight: "80%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#1B5E20",
//     flex: 1,
//   },
//   closeButton: {
//     padding: 4,
//   },
//   hospitalList: {
//     paddingBottom: 8,
//   },
//   hospitalCard: {
//     backgroundColor: "#f8fdf8",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#dcfce7", // green-100 equivalent
//   },
//   hospitalName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1B5E20",
//     marginBottom: 8,
//   },
//   hospitalDetails: {
//     gap: 6,
//   },
//   detailRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   detailText: {
//     fontSize: 14,
//     color: "#4CAF50",
//     marginLeft: 6,
//     flex: 1,
//   },
//   doctorCount: {
//     fontSize: 14,
//     color: "#4CAF50",
//     marginTop: 4,
//   },
//   emptyHospitalText: {
//     textAlign: "center",
//     color: "#6b7280",
//     fontSize: 16,
//     padding: 20,
//   },
// });

// export default SpecialtiesPage;


import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Hospital, Review } from "../Redux/HospitalsData";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import Navbar from "../Components/Navbar";
import { Header } from "../Components/Common";
import LoadingSpinner from "../Components/LoadingSpinner";

interface HospitalDetails {
  id: string;
  name: string;
  rating: number;
  doctorCount: number;
  location: string;
}

interface SpecialtyWithHospitals {
  id?: string;
  name: string;
  description: string;
  hospitals: HospitalDetails[];
}

// SVG-like illustrations using emojis
const specialtyIllustrations: { [key: string]: string } = {
  Cardiology: "❤️",
  Neurology: "🧠",
  Orthopedics: "🦴",
  Ophthalmology: "👁️",
  General: "🏥",
  Default: "⭐",
};

// Function to gather specialties with associated hospitals
const getAllSpecialtiesWithHospitals = (
  hospitals: Hospital[]
): SpecialtyWithHospitals[] => {
  const specialtiesMap: { [key: string]: SpecialtyWithHospitals } = {};

  hospitals.forEach((hospital) => {
    hospital.specialties.forEach((specialty) => {
      if (!specialtiesMap[specialty.name]) {
        specialtiesMap[specialty.name] = {
          id: specialty._id,
          name: specialty.name,
          description: specialty.description || "No description provided.",
          hospitals: [],
        };
      }

      specialtiesMap[specialty.name].hospitals.push({
        id: hospital._id ?? "",
        name: hospital.name,
        rating: calculateAverageRating(hospital.reviews),
        doctorCount: specialty.doctors.length,
        location: hospital.address,
      });
    });
  });

  return Object.values(specialtiesMap);
};

const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

const SpecialtiesPage = ({ navigation }: { navigation: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyWithHospitals | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const hospitals = useSelector(
    (state: RootState) => state.hospitalData.hospitals
  );

  // Use useMemo to prevent recalculation on every render
  const specialties = useMemo(() => 
    getAllSpecialtiesWithHospitals(hospitals),
    [hospitals]
  );

  // Use useMemo for filtered specialties to prevent unnecessary recalculations
  const filteredSpecialties = useMemo(() => {
    if (!searchTerm.trim()) return specialties;
    
    return specialties.filter(
      (specialty) =>
        specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [specialties, searchTerm]);

  const handleSpecialtyPress = (specialty: SpecialtyWithHospitals) => {
    setSelectedSpecialty(specialty);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSpecialty(null);
  };

  const navigateToHospital = (hospitalId: string) => {
    setModalVisible(false);
    navigation.navigate("HospitalDetails", { id: hospitalId });
  };

  if (hospitals.length === 0) {
    return <LoadingSpinner />;
  }

  const renderSpecialtyCard = ({ item }: { item: SpecialtyWithHospitals }) => (
    <TouchableOpacity
      style={styles.specialtyCard}
      onPress={() => handleSpecialtyPress(item)}
    >
      <Text style={styles.specialtyIcon}>
        {specialtyIllustrations[item.name] || specialtyIllustrations.Default}
      </Text>
      <Text style={styles.specialtyName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.specialtyDescription} numberOfLines={3}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const renderHospitalItem = ({ item }: { item: HospitalDetails }) => (
    <TouchableOpacity
      style={styles.hospitalCard}
      onPress={() => navigateToHospital(item.id)}
    >
      <Text style={styles.hospitalName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.hospitalDetails}>
        <View style={styles.detailRow}>
          <Feather name="star" size={16} color="#FFD700" />
          <Text style={styles.detailText}>{item.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Feather name="map-pin" size={16} color="#4CAF50" />
          <Text style={styles.detailText} numberOfLines={1}>{item.location}</Text>
        </View>
        <Text style={styles.doctorCount}>
          {item.doctorCount} doctor{item.doctorCount > 1 ? "s" : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Navbar />
      
      <View style={styles.content}>
        <Header
          onBackClick={() => navigation.goBack()}
          title="Medical Specialties"
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather
              name="search"
              size={20}
              color="#4CAF50"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search specialties..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Specialties Grid */}
        {filteredSpecialties.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No specialties found.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredSpecialties}
            keyExtractor={(item) => item.id!}
            renderItem={renderSpecialtyCard}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>

      {/* Modal for Hospital List */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedSpecialty?.name} Hospitals
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Feather name="x" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedSpecialty?.hospitals || []}
              keyExtractor={(item) => item.id}
              renderItem={renderHospitalItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.hospitalList}
              ListEmptyComponent={
                <Text style={styles.emptyHospitalText}>
                  No hospitals found for this specialty.
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    position: "relative",
  },
  searchInput: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 44,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 12,
    zIndex: 1,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  specialtyCard: {
    width: CARD_WIDTH,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialtyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  specialtyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    textAlign: "center",
    marginBottom: 8,
  },
  specialtyDescription: {
    fontSize: 12,
    color: "#4CAF50",
    textAlign: "center",
    lineHeight: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1B5E20",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  hospitalList: {
    paddingBottom: 8,
  },
  hospitalCard: {
    backgroundColor: "#f8fdf8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 8,
  },
  hospitalDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 6,
    flex: 1,
  },
  doctorCount: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 4,
  },
  emptyHospitalText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    padding: 20,
  },
});

export default SpecialtiesPage;