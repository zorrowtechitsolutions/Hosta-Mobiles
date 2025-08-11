import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import Map from "../Components/Map";
import { ArrowLeft } from "lucide-react-native";
import { Info } from "../Components/HospitalDetails/Info";
import { Specialties } from "../Components/HospitalDetails/Specialties";
import { WorkingHours } from "../Components/HospitalDetails/WorkingHours";
import { ReviewComponent } from "../Components/HospitalDetails/Review";
import { Button } from "../Components/HospitalDetails/Button";
import Navbar from "../Components/Navbar";

const HospitalDetails = () => {
  const [activeTab, setActiveTab] = useState("info");
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };

  const { hospitals } = useSelector((state: RootState) => state.hospitalData);
  const hospital = hospitals.find((hospital) => hospital._id === id);

  if (!hospital) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Hospital not found</Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <Info hospital={hospital} />;
      case "specialties":
        return <Specialties hospital={hospital} navigation={navigation} />;
      case "hours":
        return <WorkingHours hospital={hospital} />;
      case "location":
        return <Map hospital={hospital} />;
      case "reviews":
        return <ReviewComponent hospital={hospital} navigation={navigation} />;
      default:
        return null;
    }
  };

  const renderItem = useCallback(() => {
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                hospital.image?.imageUrl ||
                `https://via.placeholder.com/300x200`,
            }}
            style={styles.hospitalImage}
          />
          <View style={styles.overlay}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          data={["info", "specialties", "hours", "location", "reviews"]}
          renderItem={({ item }) => (
            <Button
              activeTab={activeTab}
              content={item.charAt(0).toUpperCase() + item.slice(1)}
              purpose={item}
              OnClick={() => setActiveTab(item)}
            />
          )}
          keyExtractor={(item) => item}
        />

        <View style={styles.content}>{renderTabContent()}</View>
      </View>
    );
  }, [activeTab, hospital, navigation]);

  return (
    <View style={styles.container}>
      <Navbar />
      <FlatList
        data={[{ key: "content" }]}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  scrollContent: {
    minHeight: height,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 240,
  },
  hospitalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  hospitalName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    padding: 8,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 8,
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default HospitalDetails;