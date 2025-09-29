import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/Store";
import { Feather } from "@expo/vector-icons";
import { Header } from "../Components/Common";
import Navbar from "../Components/Navbar";
import LoadingSpinner from "../Components/LoadingSpinner";
import { convertTo12HourFormat } from "../Components/HospitalDetails/WorkingHours";
import { setHospitalData } from "../Redux/HospitalsData";
import { apiClient } from "../Components/Axios";

interface DoctorWithHospitalSchedules {
  _id: string;
  name: string;
  specialty: string;
  hospitalSchedules: {
    hospitalId: string;
    hospitalName: string;
    address: string;
    phone: string;
    consulting: { day: string; start_time: string; end_time: string }[];
  }[];
}


interface BookingData {
  user_name: string;
  mobile: string;
  email: string;
  booking_date: string;
  booking_time: string;
}

const getAllDoctorsWithHospitalSchedules = (
  hospitals: any[]
): DoctorWithHospitalSchedules[] => {
  const doctorMap = new Map<string, DoctorWithHospitalSchedules>();
  
  hospitals.forEach((hospital) => {
    hospital.specialties?.forEach((specialty: any) => {
      specialty.doctors?.forEach((doctor: any) => {
        const key = `${doctor.name}-${specialty.name}`;
        if (!doctorMap.has(key)) {
          doctorMap.set(key, { 
            ...doctor, 
            specialty: specialty.name, 
            hospitalSchedules: [] 
          });
        }
        const existingDoctor = doctorMap.get(key)!;
        existingDoctor.hospitalSchedules.push({
          hospitalId: hospital._id || "",
          hospitalName: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          consulting: doctor.consulting || [],
        });
      });
    });
  });
  
  return Array.from(doctorMap.values());
};

const DoctorsPage = ({ navigation }: { navigation: any }) => {

  const dispatch = useDispatch();
  const { hospitals = [] } = useSelector((state: RootState) => state.hospitalData);

  

  const [doctors, setDoctors] = useState<DoctorWithHospitalSchedules[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithHospitalSchedules[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithHospitalSchedules | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    user_name: "",
    mobile: "",
    email: "",
    booking_date: "",
    booking_time: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Fetch hospitals if not in Redux
  useEffect(() => {
    const fetchHospitals = async () => {
      if (hospitals.length === 0) {
        setLoading(true);
        setApiError(false);
        try {
          const result = await apiClient.get("/api/hospitals");
          
          dispatch(setHospitalData({ data: result.data.data }));
        } catch (err: any) {
          console.error("API Error:", err);
          setApiError(true);
          Alert.alert(
            "Connection Issue", 
            "Unable to fetch hospital data. Showing available data.",
            [{ text: "OK" }]
          );
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHospitals();
  }, [dispatch, hospitals.length]);

  useEffect(() => {
    if (hospitals.length > 0) {
      const allDoctors = getAllDoctorsWithHospitalSchedules(hospitals);
      setDoctors(allDoctors);
      setFilteredDoctors(allDoctors);
    }
  }, [hospitals]);

  useEffect(() => {
    if (doctors.length > 0) {
      const results = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(results);
    } else {
      setFilteredDoctors([]);
    }
  }, [searchTerm, doctors]);

  const handleDoctorPress = (doctor: DoctorWithHospitalSchedules) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
    setBookingData({
      user_name: "",
      mobile: "",
      email: "",
      booking_date: "",
      booking_time: "",
    });
  };

  const handleBookingChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async (hospitalId: string) => {
    if (!selectedDoctor) return;

    // Basic validation
    if (!bookingData.user_name || !bookingData.mobile || !bookingData.booking_date || !bookingData.booking_time) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setBookingLoading(true);
    try {
      await apiClient.post("/api/appointments", {
        ...bookingData,
        doctor_name: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        hospitalId,
      });
      Alert.alert("Success", "Appointment booked successfully!");
      closeModal();
    } catch (err: any) {
      console.error("Booking Error:", err);
      Alert.alert(
        "Booking Failed", 
        "Unable to book appointment. Please try again later."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const renderDoctorCard = (doctor: DoctorWithHospitalSchedules) => (
    <TouchableOpacity
      key={`${doctor._id}-${doctor.specialty}`} // unique key

      style={styles.doctorCard}
      onPress={() => handleDoctorPress(doctor)}
    >
      <View style={styles.doctorAvatar}>
        <Text style={styles.avatarText}>
          {doctor.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.doctorName} numberOfLines={1}>
        {doctor.name}
      </Text>
      <Text style={styles.doctorSpecialty} numberOfLines={1}>
        {doctor.specialty}
      </Text>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => handleDoctorPress(doctor)}
      >
        <Text style={styles.bookButtonText}>View & Book</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && hospitals.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Navbar />
      
      <View style={styles.content}>
        <Header
          onBackClick={() => navigation.goBack()}
          title="Our Doctors"
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
              placeholder="Search doctors by name or specialty"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* API Error Message */}
        {apiError && (
          <View style={styles.errorBanner}>
            <Feather name="wifi-off" size={20} color="#FFFFFF" />
            <Text style={styles.errorText}>
              Using offline data. Some features may be limited.
            </Text>
          </View>
        )}

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="users" size={64} color="#4CAF50" />
            <Text style={styles.emptyText}>
              {doctors.length === 0 ? "No doctors available" : "No doctors found"}
            </Text>
            {apiError && (
              <Text style={styles.offlineText}>
                Check your connection and pull down to refresh
              </Text>
            )}
          </View>
        ) : (
          <ScrollView 
            style={styles.doctorsGrid}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContent}
          >
            <View style={styles.gridContainer}>
              {filteredDoctors.map(renderDoctorCard)}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Modal for Doctor Details and Booking */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.doctorHeader}>
                  <Text style={styles.doctorEmoji}>👨‍⚕️</Text>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.modalDoctorName}>
                      {selectedDoctor?.name}
                    </Text>
                    <Text style={styles.modalDoctorSpecialty}>
                      {selectedDoctor?.specialty}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Feather name="x" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>

              {/* Hospital Schedules */}
              {selectedDoctor?.hospitalSchedules.map((hospital, index) => (
                <View 
                    key={hospital.hospitalId || Math.random().toString()}

                style={styles.hospitalSchedule}>
                  <TouchableOpacity
                    onPress={() => {
                      closeModal();
                      navigation.navigate("HospitalDetails", { 
                        id: hospital.hospitalId 
                      });
                    }}
                  >
                    <Text style={styles.hospitalName}>
                      {hospital.hospitalName}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.hospitalAddress}>
                    {hospital.address}
                  </Text>
                  <Text style={styles.hospitalPhone}>
                    📞 {hospital.phone}
                  </Text>

                  {/* Availability Table */}
                  {hospital.consulting.length > 0 ? (
                    <View style={styles.availabilityTable}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Day</Text>
                        <Text style={styles.tableHeaderText}>Time</Text>
                      </View>
                      {hospital.consulting.map((slot, slotIndex) => (
                        <View 
                          key={`${slot.day}-${slot.start_time}-${slot.end_time}`}
                          style={[
                            styles.tableRow,
                            slotIndex % 2 === 0 && styles.tableRowEven
                          ]}
                        >
                          <Text style={styles.tableCell}>{slot.day}</Text>
                          <Text style={styles.tableCell}>
                            {convertTo12HourFormat(slot.start_time)} -{" "}
                            {convertTo12HourFormat(slot.end_time)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noScheduleText}>
                      No schedule available
                    </Text>
                  )}

                  {/* Booking Form */}
                  <View style={styles.bookingForm}>
                    <Text style={styles.bookingTitle}>Book Appointment</Text>
                    
                    <View style={styles.inputContainer}>
                      <Feather name="user" size={20} color="#4CAF50" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Your Name *"
                        value={bookingData.user_name}
                        onChangeText={(text) => handleBookingChange('user_name', text)}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Feather name="phone" size={20} color="#4CAF50" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Mobile Number *"
                        value={bookingData.mobile}
                        onChangeText={(text) => handleBookingChange('mobile', text)}
                        keyboardType="phone-pad"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Feather name="mail" size={20} color="#4CAF50" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={bookingData.email}
                        onChangeText={(text) => handleBookingChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Feather name="calendar" size={20} color="#4CAF50" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Booking Date *"
                        value={bookingData.booking_date}
                        onChangeText={(text) => handleBookingChange('booking_date', text)}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Feather name="clock" size={20} color="#4CAF50" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Booking Time *"
                        value={bookingData.booking_time}
                        onChangeText={(text) => handleBookingChange('booking_time', text)}
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        bookingLoading && styles.submitButtonDisabled
                      ]}
                      onPress={() => handleBookingSubmit(hospital.hospitalId)}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.submitButtonText}>
                          Book Appointment
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 14,
  },
  doctorsGrid: {
    flex: 1,
  },
  gridContent: {
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  doctorCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    textAlign: "center",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: "auto",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },
  offlineText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalScrollView: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  doctorEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  modalDoctorName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1B5E20",
  },
  modalDoctorSpecialty: {
    fontSize: 16,
    color: "#4CAF50",
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  hospitalSchedule: {
    borderWidth: 1,
    borderColor: "#dcfce7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8fdf8",
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 4,
    textDecorationLine: "underline",
  },
  hospitalAddress: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 4,
  },
  hospitalPhone: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 12,
  },
  availabilityTable: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E20",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tableRowEven: {
    backgroundColor: "#f8fdf8",
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: "#4CAF50",
  },
  noScheduleText: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 16,
  },
  bookingForm: {
    marginTop: 16,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 25,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DoctorsPage;