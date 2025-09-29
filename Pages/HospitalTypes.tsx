import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Header } from "../Components/Common";
import Navbar from "../Components/Navbar";

interface HospitalType {
  title: string;
  image: string;
}

const HospitalTypeCard = ({
  title,
  image,
  navigation,
}: {
  title: string;
  image: string;
  navigation: any;
}) => (
  <TouchableOpacity
    key={title}
    style={styles.card}
    onPress={() => navigation.navigate("Hospitals", { type: title })}
  >
    <View style={styles.cardContent}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image || "https://via.placeholder.com/300x200" }}
          style={styles.image}
        />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const HospitalTypeCards = ({ navigation }: { navigation: any }) => {
  const hospitalTypes: HospitalType[] = [
    {
      title: "Allopathy",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075523/Allopathy_ybcnoz.jpg",
    },
    {
      title: "Homeopathy",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Homeopathy_iqjctu.jpg",
    },
    {
      title: "Ayurveda",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075523/Ayurveda_wu9ia9.jpg",
    },
    {
      title: "Unani",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Unani_exl5fx.jpg",
    },
    {
      title: "Acupuncture",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075523/Acupunture_ajxuvc.jpg",
    },
    {
      title: "De-addiction",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075523/Deaddiction_iiaqml.jpg",
    },
    {
      title: "Mental Health",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/mental_health_cjcvop.jpg",
    },
    {
      title: "Laboratory",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Lab_kuj0ha.jpg",
    },
    {
      title: "Eye Care",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Eye_wyynmz.jpg",
    },
    {
      title: "Physiotherapy",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Physiotherapy_i6ezv8.jpg",
    },
    {
      title: "Other",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Others_wf9afk.jpg",
    },
  ];

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.contentContainer}>
        <Header
          onBackClick={() => navigation.navigate("Home")}
          title="Hospital Types"
        />
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.cardsContainer}>
            {hospitalTypes.map((type, index) => (
              <View key={index} style={styles.cardLink}>
                <HospitalTypeCard
                  title={type.title}
                  image={type.image}
                  navigation={navigation}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Add some bottom padding
  },
  cardsContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardLink: {
    width: "48%",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardContent: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    resizeMode: "cover",
    opacity: 0.8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1B5E20",
    textAlign: "center",
  },
});

export default HospitalTypeCards;
