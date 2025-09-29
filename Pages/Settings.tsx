import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import apiClient from "../Components/Axios";
import { useDispatch } from "react-redux";
import { updateUserData } from "../Redux/UserData";
import { errorToast, successToast } from "../Components/Toastify";
import { getInitial } from "./Blood";
import {
  Delete,
  Edit2,
  X,
  Save,
  Calendar,
  MapPin,
  Droplet,
  Trash2,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeBlood } from "../Redux/BloodData";

export default function Profile({ navigation }: { navigation: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<any>({});
  const [donor, setDonor] = useState<any>(null);
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const [deleteDonor, setDeleteDonor] = useState<any>(false);

  const handleSave = async () => {
    try {
      const name = editableData?.name;

      const result = await apiClient.put(
        `/api/users/${user?._id}`,
        { name },
        {
          withCredentials: true,
        }
      );

      successToast("Profile updated successfully");
      dispatch(updateUserData(result.data.user));
      setUser(result.data.user);
      setIsEditing(false);
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Profile update failed");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const _id = await AsyncStorage.getItem("userId");
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
  }, [user?._id]);

  const handleDelete = async (id: any) => {
    try {
      await apiClient.delete(`/api/donors/${id}`);
      setDonor(null);
      dispatch(removeBlood(id));
      successToast("Donor information deleted successfully");
      setDeleteDonor(false);
    } catch (error) {
      console.error("Failed to delete donor", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with close button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <X size={24} color="#2F855A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text allowFontScaling={false} style={styles.avatarInitial}>
                {getInitial(user?.name as string)}
              </Text>
            </View>

            {!isEditing ? (
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => setIsEditing(true)}
              >
                <Edit2 size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.editIconActive}
                onPress={handleSave}
              >
                <Save size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* User Info */}
          <View style={styles.infoContainer}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editableData?.name || user?.name || ""}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, name: text })
                }
                placeholder="Full Name"
              />
            ) : (
              <Text style={styles.name}>{user?.name}</Text>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoText}>
                {user?.phone || "Not provided"}
              </Text>
            </View>
          </View>
        </View>

        {/* Donor Information Card */}
        {donor && (
          <View style={styles.donorCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Blood Donor Information</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setDeleteDonor(true)}
              >
                <Trash2 size={20} color="#ff3b30" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Droplet size={16} color="#ff3b30" />
              </View>
              <Text style={styles.detailLabel}>Blood Group:</Text>
              <Text style={styles.detailValue}>{donor?.bloodGroup}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Calendar size={16} color="#555" />
              </View>
              <Text style={styles.detailLabel}>Date of Birth:</Text>
              <Text style={styles.detailValue}>
                {donor?.dateOfBirth
                  ? new Date(donor.dateOfBirth).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MapPin size={16} color="#555" />
              </View>
              <Text style={styles.detailLabel}>Location:</Text>
              <View>
                {donor?.address?.place && (
                  <Text style={styles.detailValue}>
                    {donor?.address?.place}
                  </Text>
                )}
                {donor?.address?.district && (
                  <Text style={styles.detailValue}>
                    {" "}
                    {donor?.address?.district}
                  </Text>
                )}
                {donor?.address?.state && (
                  <Text style={styles.detailValue}>
                    {" "}
                    {donor?.address?.state}
                  </Text>
                )}
                {donor?.address?.country && (
                  <Text style={styles.detailValue}>
                    {" "}
                    {donor?.address?.country}{" "}
                  </Text>
                )}
                {donor?.address?.pincode && (
                  <Text style={styles.detailValue}>
                    {donor?.address?.pincode}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        <Modal
          visible={deleteDonor}
          transparent
          animationType="fade"
          onRequestClose={() => setDeleteDonor(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Donor</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this donor information?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setDeleteDonor(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(donor._id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
    marginTop: 30,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f1f3f5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  headerRightPlaceholder: {
    width: 40,
  },
  profileCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#A5D6A7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 32,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#66BB6A",
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  editIconActive: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#28a745",
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    fontSize: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 16,
    textAlign: "center",
    backgroundColor: "#f8f9fa",
  },
  infoRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 12,
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  donorCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  deleteButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#fff0f0",
  },
  detailRow: {
    flexDirection: "row",
    // alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    width: 110,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#66BB6A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#f1f3f5",
  },
  deleteBtn: {
    backgroundColor: "#ff3b30",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});
