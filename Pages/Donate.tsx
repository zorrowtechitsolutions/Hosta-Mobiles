import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Phone, Calendar, MapPin, Droplet, Hash } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import apiClient from "../Components/Axios";
import { errorToast, successToast } from "../Components/Toastify";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/Store";
// import { setBloods } from "../Redux/BloodData";
  import { addBlood } from "../Redux/BloodData";


type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "";
type FormData = {
  phone: string;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  place: string;
  pincode: string;
  lastDonationDate: string;
};

const BLOOD_GROUPS: Exclude<BloodGroup, "">[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

const CreateDonor = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();


  const { phone, _id } = useSelector(
     (state: RootState) => state.userLogin
   );
   

  const [formData, setFormData] = useState<FormData>({
    phone:phone as string,
    dateOfBirth: "",
    bloodGroup: "",
    place: "",
    pincode: "",
    lastDonationDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be exactly 10 digits";

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.place) newErrors.place = "Place is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const payload = {
      phone: formData.phone.startsWith("0") ? formData.phone.slice(1) : formData.phone,
      dateOfBirth: formData.dateOfBirth,
      bloodGroup: formData.bloodGroup,
      address: { place: formData.place, pincode: Number(formData.pincode) },
      // lastDonationDate: formData.lastDonationDate || null,
      userId: _id, // ideally from Redux auth
    };

    const res = await apiClient.post("/api/donors", { newDonor: payload }, { withCredentials: true });

    // ✅ optimistic update (append or update)
    dispatch(addBlood(res.data.donor));

    successToast("Donor created successfully!");
    navigation.goBack(); // list is already updated

  } catch (err: any) {
    errorToast(err?.response?.data?.message || "Failed to create donor");
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.header}>Register Blood Donor</Text>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Phone size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={formData.phone}
              onChangeText={(text) => handleChange("phone", text)}
              readOnly
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Calendar size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={formData.dateOfBirth}
              onChangeText={(text) => handleChange("dateOfBirth", text)}
            />
          </View>
          {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

          {/* Blood Group */}
          <View style={styles.inputGroup}>
            <Droplet size={18} color="#66BB6A" style={styles.icon} />
            <Picker
              selectedValue={formData.bloodGroup}
              style={{ flex: 1, color: "#2E7D32" }}
              onValueChange={(value: BloodGroup) => handleChange("bloodGroup", value)}
            >
              <Picker.Item label="Select Blood Group" value="" />
              {BLOOD_GROUPS.map((bg) => (
                <Picker.Item key={bg} label={bg} value={bg} />
              ))}
            </Picker>
          </View>
          {errors.bloodGroup && <Text style={styles.errorText}>{errors.bloodGroup}</Text>}

          {/* Address - Place */}
          <View style={styles.inputGroup}>
            <MapPin size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Place"
              value={formData.place}
              onChangeText={(text) => handleChange("place", text)}
            />
          </View>
          {errors.place && <Text style={styles.errorText}>{errors.place}</Text>}

          {/* Address - Pincode */}
          <View style={styles.inputGroup}>
            <Hash size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="number-pad"
              value={formData.pincode}
              onChangeText={(text) => handleChange("pincode", text)}
            />
          </View>
          {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}

          {/* Last Donation Date */}
          {/* <View style={styles.inputGroup}>
            <Calendar size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Last Donation Date (YYYY-MM-DD)"
              value={formData.lastDonationDate}
              onChangeText={(text) => handleChange("lastDonationDate", text)}
            />
          </View> */}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.create]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECFDF5", padding: 16 },
  scrollView: { flexGrow: 1, justifyContent: "center" },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: "#F1F8E9",
  },
  input: { flex: 1, fontSize: 16, color: "#2E7D32" },
  icon: { marginRight: 8 },
  errorText: { color: "#D32F2F", fontSize: 12, marginBottom: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  create: { backgroundColor: "#66BB6A", marginRight: 6 },
  cancel: { backgroundColor: "#E53935", marginLeft: 6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default CreateDonor;