import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Phone,
} from "lucide-react-native";
import { convertTo12HourFormat } from "../Components/HospitalDetails/WorkingHours";
import { Header } from "../Components/Common";
import Navbar from "../Components/Navbar";

interface Doctor {
  _id: string;
  name: string;
  qualification: string;
  consulting: { day: string; start_time: string; end_time: string }[];
}

const DepartmentDoctorsPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { departmentId, hospitalId } = route.params as {
    departmentId: string;
    hospitalId: string;
  };

  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);

  const { hospitals } = useSelector((state: RootState) => state.hospitalData);
  const hospital = hospitals.find((hos) => hos._id === hospitalId);
  const department = hospital?.specialties.find(
    (dept) => dept._id === departmentId
  );

  const toggleDoctorExpansion = (doctorId: string) => {
    setExpandedDoctor(expandedDoctor === doctorId ? null : doctorId);
  };

  const initiateCall = () => {
    if (department) {
      const phoneNumber = `tel:${department.phone}`;
      Linking.openURL(phoneNumber);
    }
    setShowCallModal(false);
  };

  if (!department) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Department not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <Header onBackClick={() => navigation.goBack()} title={department.name} />
      <ScrollView contentContainerStyle={styles.content}>
        {department.doctors.map((doctor) => (
          <View key={doctor._id} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleDoctorExpansion(doctor._id as string)}
            >
              <View>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorQualification}>
                  {doctor.qualification}
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
                <Text style={styles.consultingHours}>
                  <Clock size={16} color="#28a745" /> Consultation Hours:
                </Text>
                {doctor.consulting.map((schedule, index) => (
                  <Text key={index} style={styles.consultingDetails}>
                    {schedule.day}: {convertTo12HourFormat(schedule.start_time)}{" "}
                    - {convertTo12HourFormat(schedule.end_time)}
                  </Text>
                ))}
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => setShowCallModal(true)}
                >
                  <Phone size={16} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Department Information</Text>
          <Text style={styles.infoText}>{department.description}</Text>
        </View>
      </ScrollView>

      <Modal visible={showCallModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Call Department</Text>
            <Text style={styles.modalText}>
              You're about to call the {department.name} department. Click the
              button below to call {department.phone}.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCallModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCallButton}
                onPress={initiateCall}
              >
                <Phone size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.modalCallText}>Call Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DepartmentDoctorsPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECFDF5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 16,
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  doctorName: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
  doctorQualification: { fontSize: 14, color: "#6c757d" },
  cardContent: { padding: 16 },
  consultingHours: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#28a745",
  },
  consultingDetails: { fontSize: 14, color: "#6c757d", marginBottom: 4 },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  callButtonText: { color: "#fff", fontWeight: "bold" },
  infoCard: { padding: 16, backgroundColor: "#e9f6ea", borderRadius: 8 },
  infoTitle: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
  infoText: { fontSize: 14, color: "#6c757d" },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 8,
  },
  modalText: { fontSize: 14, color: "#6c757d", marginBottom: 16 },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalCancelButton: {
    padding: 12,
    backgroundColor: "#f1f3f5",
    borderRadius: 8,
  },
  modalCancelText: { fontSize: 14, color: "#6c757d" },
  modalCallButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
  },
  modalCallText: { color: "#fff", fontWeight: "bold" },
});
