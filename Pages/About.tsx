import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Navbar from "../Components/Navbar";
import {
  Ambulance,
  Search,
  Calendar,
  Clipboard,
  UserPlus,
  Clock4,
} from "lucide-react-native";

export default function AboutPage() {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>About Our Hospital Finder</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Welcome to our innovative hospital finder platform, where we connect
            patients with nearby hospitals and doctors. Our mission is to
            simplify healthcare access and improve the overall patient
            experience.
          </Text>
          <Text style={styles.paragraph}>
            With our user-friendly interface, you can easily find hospitals,
            book appointments, and even access emergency ambulance services. For
            healthcare providers, we offer a seamless registration process to
            showcase your facilities and specialties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Key Features</Text>
          <View style={styles.grid}>
            <FeatureCard
              icon={<Search color="#2F855A" size={48} />}
              title="Find Nearby Hospitals"
              description="Easily locate hospitals and clinics in your area"
            />
            <FeatureCard
              icon={<Calendar color="#2F855A" size={48} />}
              title="Book Appointments"
              description="Schedule consultations with doctors at your convenience"
            />
            <FeatureCard
              icon={<Ambulance color="#2F855A" size={48} />}
              title="Emergency Services"
              description="Quick access to nearby ambulance services"
            />
            <FeatureCard
              icon={<UserPlus color="#2F855A" size={48} />}
              title="Hospital Registration"
              description="Easy sign-up process for healthcare providers"
            />
            <FeatureCard
              icon={<Clipboard color="#2F855A" size={48} />}
              title="Specialties & Doctors"
              description="Browse hospitals by specialties and find the right doctor"
            />
            <FeatureCard
              icon={<Clock4 color="#2F855A" size={48} />}
              title="Working Hours"
              description="View hospital and doctor availability in real-time"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Find Hospitals Near You</Text>
          <Text style={styles.paragraph}>
            Use our search feature to find hospitals and doctors in your area.
            Simply enter your location to get started.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>For Hospitals</Text>
          <Text style={styles.paragraph}>
            Are you a healthcare provider? Join our platform to:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Showcase your facilities and specialties
            </Text>
            <Text style={styles.listItem}>
              • Manage appointments and patient bookings
            </Text>
            <Text style={styles.listItem}>
              • List your doctors and their availability
            </Text>
            <Text style={styles.listItem}>
              • Provide real-time updates on working hours
            </Text>
          </View>
          <Text style={styles.paragraph}>
            Contact us to learn more about registering your hospital on our
            platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Our Commitment</Text>
          <Text style={styles.paragraph}>
            At our Hospital Finder platform, we are committed to:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Simplifying access to quality healthcare services
            </Text>
            <Text style={styles.listItem}>
              • Providing accurate and up-to-date information
            </Text>
            <Text style={styles.listItem}>
              • Ensuring a seamless experience for patients and healthcare
              providers
            </Text>
            <Text style={styles.listItem}>
              • Continuously improving our platform based on user feedback
            </Text>
            <Text style={styles.listItem}>
              • Maintaining the highest standards of data privacy and security
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// FeatureCard Component for reusable feature cards
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>{icon}</View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2F855A",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    color: "#28a745",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2F855A",
    marginBottom: 8,
  },
  list: {
    marginTop: 8,
    paddingLeft: 16,
  },
  listItem: {
    fontSize: 16,
    color: "#276749",
    marginBottom: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F855A",
    marginBottom: 4,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#276749",
    textAlign: "center",
  },
});