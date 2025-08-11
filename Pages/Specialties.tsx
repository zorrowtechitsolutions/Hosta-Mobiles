import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
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
          description: specialty.description,
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
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

const SpecialtiesPage = ({ navigation }: { navigation: any }) => {
  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const hospitals = useSelector(
    (state: RootState) => state.hospitalData.hospitals
  );

  const specialties = getAllSpecialtiesWithHospitals(hospitals);
  const [filteredSpecialties, setFilteredSpecialties] =
    useState<SpecialtyWithHospitals[]>(specialties);

  useEffect(() => {
    const filtered = specialties.filter(
      (specialty) =>
        specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpecialties(filtered);
  }, [searchTerm]);

  const toggleSpecialtyExpansion = (specialtyId: string) => {
    setExpandedSpecialty(
      expandedSpecialty === specialtyId ? null : specialtyId
    );
  };

  const navigateToHospital = (hospitalId: string) => {
    navigation.navigate("HospitalDetails", { id: hospitalId });
  };

  if (hospitals.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <Header
        onBackClick={() => {
          navigation.navigate("Home");
        }}
        title="Medical Specialties"
      />
      <View style={{ padding: 16 }}>
        <View style={styles.searchContainer}>
          <Icon
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

        <FlatList
          data={filteredSpecialties}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <View style={styles.specialtyCard}>
              <TouchableOpacity
                style={styles.specialtyHeader}
                onPress={() => toggleSpecialtyExpansion(item.id!)}
              >
                <Text style={styles.specialtyName}>{item.name}</Text>
                <Icon
                  name={
                    expandedSpecialty === item.id
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={20}
                  color="#4CAF50"
                />
              </TouchableOpacity>
              {expandedSpecialty === item.id && (
                <View style={styles.hospitalList}>
                  <Text style={styles.hospitalListTitle}>
                    Hospitals with {item.name}
                  </Text>
                  {item.hospitals.map((hospital) => (
                    <TouchableOpacity
                      key={hospital.id}
                      style={styles.hospitalCard}
                      onPress={() => navigateToHospital(hospital.id)}
                    >
                      <Text style={styles.hospitalName}>{hospital.name}</Text>
                      <View style={styles.hospitalDetails}>
                        <Icon
                          name="star"
                          size={14}
                          color="#FFC107"
                          style={styles.hospitalIcon}
                        />
                        <Text>{hospital.rating.toFixed(1)}</Text>
                      </View>
                      <View style={styles.hospitalDetails}>
                        <Icon
                          name="map-marker"
                          size={14}
                          color="#4CAF50"
                          style={styles.hospitalIcon}
                        />
                        <Text>{hospital.location}</Text>
                      </View>
                      <Text style={styles.doctorCount}>
                        {hospital.doctorCount} doctors
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>
              No specialties found matching your search criteria.
            </Text>
          }
        />
      </View>
    </View>
  );
};

export default SpecialtiesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    // padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 16,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  specialtyCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  specialtyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  specialtyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C",
  },
  hospitalList: {
    marginTop: 16,
  },
  hospitalListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  hospitalCard: {
    backgroundColor: "#F1F8E9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  hospitalDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  hospitalIcon: {
    marginRight: 4,
  },
  doctorCount: {
    marginTop: 4,
    color: "#616161",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#616161",
    marginTop: 20,
  },
});
