import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import {
  Ambulance,
  Building2,
  Droplet,
  Hospital,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react-native";
import Navbar from "../Components/Navbar";
import AdSwiper from "../Components/Carousels";
import { useDispatch } from "react-redux";
import { getData } from "../Components/BackgroundTask";

const features = [
  { name: "Hospitals", icon: Hospital, screen: "HostpitalTypes" },
  { name: "Doctors", icon: Stethoscope, screen: "Doctors" },
  { name: "Specialties", icon: Building2, screen: "Specialties" },
  { name: "Ambulance", icon: Ambulance, screen: "Ambulance" },
  // { name: "Donate Blood", icon: Droplet, screen: "Blood-Donation" },
  { name: "Blood", icon: Droplet, screen: "Blood" },
  // { name: "Nurses", icon:  UserRound , screen: "Blood" },
];

const adImages = [
  "https://img.freepik.com/free-vector/flat-design-medical-facebook-ad_23-2149091913.jpg",
  "https://img.freepik.com/free-vector/flat-design-medical-facebook-ad_23-2149091912.jpg",
  "https://th.bing.com/th/id/OIP.yTcG-jZWUKXEzm18Jcr2yAHaEK?w=800&h=450&rs=1&pid=ImgDetMain",
];

const HomePage = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    getData(dispatch);
  }, [dispatch]);

  return (
    <ScrollView style={styles.container}>
      {/* Carousel Section */}
      <Navbar />

      <AdSwiper adImages={adImages} />

      {/* Services Section */}
      <Text style={styles.servicesHeading}>Our Services</Text>
      <View style={styles.servicesGrid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={feature.name}
            style={[
              styles.serviceCard,
              index === features.length - 1 && styles.fullWidthCard, 
            ]}
            onPress={() => navigation.navigate(feature.screen)}
          >
            <feature.icon size={32} color="#28a745" style={styles.icon} />
            <Text style={styles.serviceText}>{feature.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  servicesHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#065F46",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  serviceCard: {
    width: width / 2 - 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
    textAlign: "center",
  },
  fullWidthCard: {
    width: "100%", 
  },
});

export default HomePage;
