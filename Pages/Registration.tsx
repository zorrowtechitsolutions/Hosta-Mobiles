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
  Modal,
} from "react-native";
import { Mail, Phone, Lock, CheckCircle, X, User } from "lucide-react-native";
import { apiClient } from "../Components/Axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/Store";
import {
  updateFormData,
  sentOtp,
  setOtp,
  setRandomOtp,
  resetForm,
} from "../Redux/UserRegistration";
import { FormData } from "../Redux/UserRegistration";
import { errorToast, successToast } from "../Components/Toastify";

const UserRegistration = ({ navigation }: { navigation: any }) => {
  const { formData, otp, otpSent, randomOtp } = useSelector(
    (state: RootState) => state.userRegistration
  );
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const handleChange = (name: keyof FormData, value: string) => {
    dispatch(updateFormData({ field: name, value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile number must be 10 digits";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (!otpSent) {
        dispatch(sentOtp(true));
        setShowOtpPopup(true);

        const randomSixDigit = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        dispatch(setRandomOtp(randomSixDigit));

        try {
          await apiClient.post(
            "/api/email",
            {
              from: "hostahelthcare@gmail.com",
              to: formData.email,
              subject: "OTP VERIFICATION",
              text: `Otp for Hosta registration is ${randomSixDigit}`,
            },
            { withCredentials: true }
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        if (otp === randomOtp) {
          try {
            await apiClient.post(
              "/api/users/registeration",
              {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.mobile,
              },
              { withCredentials: true }
            );
            successToast("Registration successful!");
            dispatch(resetForm());
            navigation.navigate("Login");
          } catch (err: any) {
            errorToast(err.response?.data?.message || "Registration failed");
          }
          setShowOtpPopup(false);
        } else {
          errorToast("Wrong OTP, please try again!");
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.header}>User Registration</Text>
          <View style={styles.inputGroup}>
            <User size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <View style={styles.inputGroup}>
            <Mail size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={formData.email}
              keyboardType="email-address"
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputGroup}>
            <Phone size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              value={formData.mobile}
              keyboardType="phone-pad"
              onChangeText={(text) => handleChange("mobile", text)}
            />
          </View>
          {errors.mobile && (
            <Text style={styles.errorText}>{errors.mobile}</Text>
          )}

          <View style={styles.inputGroup}>
            <Lock size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <View style={styles.inputGroup}>
            <Lock size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {otpSent ? "Verify OTP & Register" : "Send OTP"}
            </Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Have an account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showOtpPopup} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setShowOtpPopup(false);
                dispatch(sentOtp(false));
              }}
              style={styles.closeButton}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalDescription}>
              An OTP has been sent to your email. Enter it below to complete
              registration.
            </Text>
            <View style={styles.inputGroup}>
              <CheckCircle size={18} color="#66BB6A" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                onChangeText={(text) => dispatch(setOtp(text))}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Verify & Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    padding: 16,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
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
    padding: 8,
    backgroundColor: "#F1F8E9",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2E7D32",
  },
  icon: {
    marginRight: 8,
  },
  button: {
    backgroundColor: "#66BB6A",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  modalDescription: {
    color: "#388E3C",
    textAlign: "center",
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#2E7D32",
    fontSize: 14,
  },
  linkText: {
    color: "#66BB6A",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default UserRegistration;
