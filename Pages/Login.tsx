import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { Phone, X } from "lucide-react-native";
import { apiClient } from "../Components/Axios";
import { successToast, errorToast } from "../Components/Toastify";
import { useDispatch } from "react-redux";
import { updateUserData } from "../Redux/UserData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserLogin = ({ navigation }: { navigation: any }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [timer, setTimer] = useState(60);
  const dispatch = useDispatch();

  // countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      errorToast("Enter a valid 10-digit phone number");
      return;
    }

    try {
      await apiClient
        .post("/api/users/login/phone", { phone }, { withCredentials: true })
        .then((result) => console.log(result))
        .catch((err) => console.log(err, "error"));
      successToast("OTP sent successfully!");
      setOtp("");
      setShowOtpModal(true);
      setTimer(60); // restart timer on send
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await apiClient.post(
        "/api/users/otp",
        { phone, otp },
        { withCredentials: true }
      );
      await AsyncStorage.setItem("userId", result.data.userDetails._id);

      successToast("Login successful");
      await AsyncStorage.setItem("accessToken", result.data.token);
      dispatch(updateUserData(result.data.data));
      setShowOtpModal(false);
      navigation.navigate("Home" as never);
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.header}>Login with Phone</Text>

          <View style={styles.inputGroup}>
            <Phone size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#A5D6A7"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { alignSelf: "center" }]}
            onPress={sendOtp}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don’t have an account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Register")}
              >
                Register here
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* OTP Modal */}
      <Modal visible={showOtpModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setShowOtpModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Enter OTP</Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              textAlign="center"
              editable={timer > 0} // disable after 1 min
            />

            <TouchableOpacity
              style={[styles.button, { marginBottom: 10 }]}
              onPress={verifyOtp}
              disabled={timer === 0 && otp === ""}
            >
              <Text style={styles.buttonText}>Verify & Login</Text>
            </TouchableOpacity>

            {timer > 0 ? (
              <Text style={{ color: "#2E7D32" }}>Resend OTP in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={sendOtp}>
                <Text style={[styles.linkText, { marginTop: 10 }]}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECFDF5" },
  scrollView: { flexGrow: 1, justifyContent: "center", padding: 16 },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
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
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: "#F1F8E9",
    padding: 8,
  },
  input: { flex: 1, fontSize: 16, color: "#2E7D32" },
  icon: { marginRight: 8 },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footer: { marginTop: 16, alignItems: "center" },
  footerText: { color: "#2E7D32", fontSize: 14 },
  linkText: {
    color: "#2E7D32",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 16,
    textAlign: "center",
  },
  closeButton: { position: "absolute", top: 8, right: 8 },
  otpInput: {
    width: "70%",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#F1F8E9",
    color: "#2E7D32",
    letterSpacing: 5,
    textAlign: "center",
  },
});

export default UserLogin;
