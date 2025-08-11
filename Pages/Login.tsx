import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Mail, Lock, EyeOff, Eye, AlertCircle } from "lucide-react-native";
import { apiClient } from "../Components/Axios";
import { successToast } from "../Components/Toastify";
import { useDispatch } from "react-redux";
import { updateUserData } from "../Redux/UserData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserLogin = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const result = await apiClient.post(
        "/api/users/login",
        { email: email, password: password },
        { withCredentials: true }
      );

      successToast("Login successful");
      await AsyncStorage.setItem("accessToken", result.data.token);
      dispatch(
        updateUserData({
          ...result.data.data,
          _id: result.data.data._id as string,
        })
      );

      navigation.navigate("Home" as never); // Redirect to Home screen
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.header}>User Login</Text>

          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={18} color="#D32F2F" style={styles.icon} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Mail size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#A5D6A7"
            />
          </View>

          <View style={styles.inputGroup}>
            <Lock size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#A5D6A7"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconRight}
            >
              {showPassword ? (
                <EyeOff size={18} color="#66BB6A" />
              ) : (
                <Eye size={18} color="#66BB6A" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("PasswordReset" as never)}
          >
            <Text style={styles.linkText}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2E7D32",
  },
  icon: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#D32F2F",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
  },
  linkButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  linkText: {
    color: "#2E7D32",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#2E7D32",
    fontSize: 14,
  },
});

export default UserLogin;
