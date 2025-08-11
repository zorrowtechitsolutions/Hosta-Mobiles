import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
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
        "https://th.bing.com/th/id/OIP.47Ra6GUykfLRORz713KmpwHaE6?w=232&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    {
      title: "Homeopathy",
      image:
        "https://th.bing.com/th/id/OIP.mHSxohdwswyJLGlqtk3wfwHaE7?rs=1&pid=ImgDetMain",
    },
    {
      title: "Ayurveda",
      image:
        "https://th.bing.com/th/id/OIP.naR0FBavTXRS08FGcT4mGAHaEn?rs=1&pid=ImgDetMain",
    },
    {
      title: "Unani",
      image:
        "https://th.bing.com/th/id/R.6f6ce2d6663331e471b4f4a13ad67640?rik=wMqEC%2bmw38ScAg&riu=http%3a%2f%2funanihakeem.in%2fimages%2fbg%2fbg4.jpg&ehk=w3pjl0aV%2fqER9efY0FgzhhzzP7J6cVx%2fJIBm8PXRJts%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      title: "Acupuncture",
      image:
        "https://th.bing.com/th/id/OIP.eVNH_oc408tN7zftvmyqXwHaE7?w=281&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    {
      title: "Other",
      image:
        "https://th.bing.com/th/id/OIP.4hOrUMJve5Es4c3Uvq7evAHaHr?w=2131&h=2209&rs=1&pid=ImgDetMain",
    },
  ];

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={{ paddingHorizontal: 16 }}>
        <Header
          onBackClick={() => navigation.navigate("Home")}
          title="Hospital Types"
        />
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
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
