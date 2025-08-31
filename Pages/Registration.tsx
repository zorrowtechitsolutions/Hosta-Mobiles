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
import { Mail, Phone, Lock, Eye, EyeOff, User } from "lucide-react-native";
import { apiClient } from "../Components/Axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/Store";
import { updateFormData, resetForm, FormData } from "../Redux/UserRegistration";
import { errorToast, successToast } from "../Components/Toastify";

const UserRegistration = ({ navigation }: { navigation: any }) => {
  const { formData } = useSelector(
    (state: RootState) => state.userRegistration
  );
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      try {
        const response=await apiClient.post(
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
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={18} color="#66BB6A" />
              ) : (
                <Eye size={18} color="#66BB6A" />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <View style={styles.inputGroup}>
            <Lock size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} color="#66BB6A" />
              ) : (
                <Eye size={18} color="#66BB6A" />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
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
  modalDescription: {
    color: "#388E3C",
    textAlign: "center",
    marginBottom: 16,
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
