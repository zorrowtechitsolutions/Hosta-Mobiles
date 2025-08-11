import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Hospital } from "../../Redux/HospitalsData";
import { Mail, MapPin, Phone, Star } from "lucide-react-native";

export const Info = ({ hospital }: { hospital: Hospital }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MapPin color="green" width={20} height={20} />
        <Text style={styles.text}>{hospital?.address}</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => Linking.openURL(`tel:${hospital?.phone}`)}
        >
          <Phone color="green" width={20} height={20} />
          <Text style={styles.text}>{hospital?.phone}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() =>
            Linking.openURL(
              `mailto:${hospital?.email}?subject=Inquiry&body=Hello ${hospital?.name},`
            )
          }
        >
          <Mail color="green" width={20} height={20} />
          <Text style={styles.text}>{hospital?.email}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Star color="green" width={20} height={20} />
        <Text style={styles.text}>
          {hospital?.reviews && hospital.reviews.length > 0
            ? (
                (hospital.reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
                ) /
                  (hospital.reviews.length * 5)) *
                5
              ).toFixed(1)
            : "0"}
          / out of 5 stars
        </Text>
      </View>
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>About Us</Text>
        <Text style={styles.aboutText}>{hospital?.about}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10, paddingVertical: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: "black",
  },
  aboutContainer: {
    marginTop: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "darkgreen",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 16,
    color: "green",
  },
});
