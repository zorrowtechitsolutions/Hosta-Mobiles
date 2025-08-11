import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";
import Navbar from "../Components/Navbar";
import {
  Send,
  Star,
  Phone,
  Mail,
  Facebook,
  Instagram,
} from "lucide-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { ScrollView } from "react-native-gesture-handler";
import apiClient from "../Components/Axios";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [opinion, setOpinion] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitStatus(null);

    await apiClient
      .post("/api/email", {
        from: email,
        to: "hostahealthcare@gmail.com",
        subject: `Review from: ${email}`,
        text: `Rating:${rating} Opinion:${opinion}`,
      })
      .then(() => {
        setSubmitStatus("success");
        setEmail("");
        setOpinion("");
        setRating(0);
      })
      .catch((err) => {
        console.log(err);
        setSubmitStatus("error");
      });

    setSubmitting(false);
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.header}>Contact Us</Text>

          <View style={styles.card}>
            <Text style={styles.subheader}>Send Us a Message</Text>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Opinion</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={opinion}
                  onChangeText={setOpinion}
                  placeholder="Share your feedback"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Rate Our Application</Text>
                <View style={styles.rating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Star
                        size={32}
                        color={star <= rating ? "#ffc107" : "#ccc"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Submit</Text>
                    <Send size={20} color="#fff" style={styles.sendIcon} />
                  </>
                )}
              </TouchableOpacity>

              {submitStatus === "success" && (
                <Text style={styles.successMessage}>
                  Thank you for your feedback! We've received your message.
                </Text>
              )}

              {submitStatus === "error" && (
                <Text style={styles.errorMessage}>
                  There was an error submitting your message. Please try again
                  later.
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.card]}>
            <Text style={[styles.subheader, { textAlign: "center" }]}>
              Get in Touch
            </Text>

            <View style={styles.socialLinks}>
              <TouchableOpacity onPress={() => handleLinkPress(`tel:8714412090`)}>
                <Phone size={24} color="#28a745" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLinkPress("https://wa.me/918714412090")}
              >
                <Icon name="whatsapp" size={24} color="#28a745" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleLinkPress(
                    "https://www.facebook.com/profile.php?id=61568947746890&mibextid=LQQJ4d"
                  )
                }
              >
                <Facebook size={24} color="#28a745" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleLinkPress(
                    "https://www.instagram.com/hosta_healthcare/?igsh=MnR6d3h0YTJlbXEy"
                  )
                }
              >
                <Instagram size={24} color="#28a745" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLinkPress("mailto:hostahealthcare@gmail.com?subject=Inquiry&body=Hello Hosta,")}>
                <Mail size={24} color="#28a745" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F855A",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  subheader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2F855A",
    marginBottom: 12,
  },
  form: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2F855A",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#f7fafc",
    fontSize: 16,
    color: "#2d3748",
  },
  textarea: {
    height: 100,
  },
  rating: {
    flexDirection: "row",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28a745",
    borderRadius: 4,
    paddingVertical: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sendIcon: {
    marginLeft: 8,
  },
  successMessage: {
    color: "#38a169",
    marginTop: 12,
    textAlign: "center",
  },
  errorMessage: {
    color: "#e53e3e",
    marginTop: 12,
    textAlign: "center",
  },
  contactInfo: {
    marginTop: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#2d3748",
  },
  socialLinks: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "center",
    gap: 16,
  },
});
