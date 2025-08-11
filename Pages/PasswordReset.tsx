import React, { useState } from "react";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react-native";
import { apiClient } from "../Components/Axios";
import { Header } from "../Components/Common";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const PasswordReset= ({navigation}:{navigation:any}) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // For generating a random number.
  const [randomNumber, setRandomNumber] = useState("");

  const handleEmailSubmit = async () => {
    setError("");
    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }
    // Simulate sending OTP
    const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setRandomNumber(generateOtp);

    try {
      await apiClient.post("/api/email", {
        from: "hostahelthcare@gmail.com",
        to: formData.email,
        subject: "Reset Password",
        text: `Otp for reseting your password is ${generateOtp}`,
      });
      setStep(2);
      setSuccess("OTP sent to your email address.");
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpSubmit = () => {
    setError("");
    if (!formData.otp) {
      setError("Please enter the OTP.");
      return;
    }
    console.log(formData.otp,randomNumber);
    
    // Simulate OTP verification
    if (formData.otp === randomNumber) {
      setStep(3);
      setSuccess("OTP verified successfully.");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    try {
      await apiClient.post("/api/users/password", {
        email: formData.email,
        password: formData.newPassword,
      });
      setStep(4);
      setSuccess("Password reset successfully.");
    } catch (err) {
      console.log(err);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <Button title="Send OTP" onPress={handleEmailSubmit} />
          </View>
        );
      case 2:
        return (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={formData.otp}
              onChangeText={(text) => setFormData({ ...formData, otp: text })}
            />
            <Button title="Verify OTP" onPress={handleOtpSubmit} />
          </View>
        );
      case 3:
        return (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, newPassword: text })
              }
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              secureTextEntry
            />
            <Button title="Reset Password" onPress={handlePasswordReset} />
          </View>
        );
      case 4:
        return (
          <View style={styles.successContainer}>
            <CheckCircle size={48} color="green" />
            <Text style={styles.successMessage}>Password Reset Successful</Text>
            <Text style={styles.successMessage}>
              Your password has been successfully reset.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login" as never)}
            >
              <ArrowLeft size={16} />
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Header onBackClick={() => navigation.goBack()} title="Reset Password" />
      {error && (
        <View style={styles.error}>
          <AlertCircle size={18} color="red" />
          <Text>{error}</Text>
        </View>
      )}
      {success && (
        <View style={styles.success}>
          <CheckCircle size={18} color="green" />
          <Text>{success}</Text>
        </View>
      )}
      {renderStep()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#ECFDF5",
  },
  form: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#38a169",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  successMessage: {
    fontSize: 18,
    marginTop: 12,
    color: "#38a169",
  },
  error: {
    backgroundColor: "#fed7d7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  success: {
    backgroundColor: "#c6f6d5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PasswordReset;