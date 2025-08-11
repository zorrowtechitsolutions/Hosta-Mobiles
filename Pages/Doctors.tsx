import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Search,
} from "lucide-react-native";
import { Header } from "../Components/Common";
import Navbar from "../Components/Navbar";
import LoadingSpinner from "../Components/LoadingSpinner";
import { convertTo12HourFormat } from "../Components/HospitalDetails/WorkingHours";

interface DoctorWithSpecialtyAndHospital {
  _id: string;
  name: string;
  specialty: string;
  hospitalName: string;
  hospitalId: string;
  consulting: { day: string; start_time: string; end_time: string }[];
}

const getAllDoctorsWithSpecialties = (
  hospitals: any[]
): DoctorWithSpecialtyAndHospital[] => {
  return hospitals.flatMap((hospital) =>
    hospital.specialties.flatMap((specialty: any) =>
      specialty.doctors.map((doctor: any) => ({
        ...doctor,
        specialty: specialty.name,
        hospitalName: hospital.name,
        hospitalId: hospital._id,
      }))
    )
  );
};

const DoctorsPage = ({ navigation }: { navigation: any }) => {
  const hospitals = useSelector(
    (state: RootState) => state.hospitalData.hospitals
  );

  const [doctors, setDoctors] = useState<DoctorWithSpecialtyAndHospital[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<
    DoctorWithSpecialtyAndHospital[] | null
  >(null);
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hospitals.length > 0) {
      const allDoctors = getAllDoctorsWithSpecialties(hospitals);
      setDoctors(allDoctors);
      setFilteredDoctors(allDoctors);
      setLoading(false);
    }
  }, [hospitals]);

  useEffect(() => {
    if (doctors) {
      const results = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(results);
    }
  }, [searchTerm, doctors]);

  const toggleDoctorExpansion = (doctorId: string) => {
    setExpandedDoctor(expandedDoctor === doctorId ? null : doctorId);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <Header
        onBackClick={() => navigation.navigate("Home")}
        title="Our Doctors"
      />
      <View style={styles.searchBar}>
        <Search size={20} color="#6c757d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors by name or specialty"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredDoctors?.map((doctor) => (
          <View key={doctor._id}>
            {doctor.name && (
              <View key={doctor._id} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => toggleDoctorExpansion(doctor._id)}
                >
                  <View>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>
                      {doctor.specialty}
                    </Text>
                  </View>
                  {expandedDoctor === doctor._id ? (
                    <ChevronUp size={20} color="#28a745" />
                  ) : (
                    <ChevronDown size={20} color="#28a745" />
                  )}
                </TouchableOpacity>
                {expandedDoctor === doctor._id && (
                  <View style={styles.cardContent}>
                    <Text style={styles.availabilityTitle}>Availability:</Text>
                    {doctor.consulting.map((schedule, index) => (
                      <View key={index} style={styles.availabilityRow}>
                        <Clock size={16} color="#6c757d" />
                        <Text style={styles.scheduleText}>
                          {schedule.day}:{" "}
                          {convertTo12HourFormat(schedule.start_time)} -{" "}
                          {convertTo12HourFormat(schedule.end_time)}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("HospitalDetails", {
                              id: doctor.hospitalId,
                            })
                          }
                          style={styles.hospitalLink}
                        >
                          <MapPin size={16} color="#28a745" />
                          <Text style={styles.hospitalName}>
                            {doctor.hospitalName}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

        {filteredDoctors?.length === 0 && (
          <Text style={styles.noResults}>
            No doctors found matching your search criteria.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default DoctorsPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECFDF5" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  doctorName: { fontSize: 18, fontWeight: "bold", color: "#28a745" },
  doctorSpecialty: { fontSize: 14, color: "#6c757d" },
  cardContent: {
    padding: 16,
  },
  availabilityTitle: { fontSize: 16, fontWeight: "bold", color: "#6c757d" },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  scheduleText: { marginLeft: 8, color: "#6c757d" },
  hospitalLink: { flexDirection: "row", alignItems: "center", marginLeft: 16 },
  hospitalName: {
    marginLeft: 4,
    color: "#28a745",
    textDecorationLine: "underline",
  },
  noResults: { textAlign: "center", color: "#6c757d", marginTop: 16 },
  // centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
