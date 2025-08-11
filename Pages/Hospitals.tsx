import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Hospital, WorkingHours } from "../Redux/HospitalsData";
import { RootState } from "../Redux/Store";
import { FormInput, Header } from "../Components/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import Navbar from "../Components/Navbar";
import { ScrollView } from "react-native-gesture-handler";

export default function HospitalsPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpenNow, setFilterOpenNow] = useState(false);

  const { hospitals = [] } = useSelector(
    (state: RootState) => state.hospitalData
  );
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.userLogin
  );

  const HospitalsType = route.params?.type || "";

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const isOpenNow = (workingHours: WorkingHours[]) => {
    const now = new Date();
    console.log("Current date and time:", now.toISOString());

    const currentDay = now
      .toLocaleString("en-US", {
        weekday: "long",
        timeZone: "Asia/Kolkata",
      })
      .toString()
      .split(" ")[0];
    const Time = now
      .toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      })
      .toString();
    const match = Time.match(/\b\d{2}:\d{2}\b/);
    const currentTime = match ? match[0] : null;

    console.log("Current day:", currentDay);
    console.log("Current time:", currentTime);

    const todayHours = workingHours.find(
      (wh) => wh.day.toLowerCase().slice(0, 3) == currentDay.toLowerCase()
    );

    console.log("Today's hours:", todayHours);
    if (
      !todayHours ||
      todayHours.is_holiday ||
      !todayHours.opening_time ||
      !todayHours.closing_time
    ) {
      console.log("Returning false due to missing or holiday hours");
      return false;
    }

    const { opening_time, closing_time } = todayHours;

    console.log("Opening time:", opening_time);
    console.log("Closing time:", closing_time);

    const currentTimeMinutes = parseTimeToMinutes(currentTime as string);
    const openingTimeMinutes = parseTimeToMinutes(opening_time);
    const closingTimeMinutes = parseTimeToMinutes(closing_time);

    const isOpen =
      currentTimeMinutes >= openingTimeMinutes &&
      currentTimeMinutes <= closingTimeMinutes;
    console.log("Is open:", isOpen);

    return isOpen;
  };

  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  if (hospitals.length === 0) {
    return <LoadingSpinner />;
  }

  const filteredAndSortedHospitals = hospitals
    .filter(
      (hospital: Hospital) =>
        hospital?.type?.toLowerCase() === HospitalsType?.toLowerCase() &&
        (hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterOpenNow || isOpenNow(hospital.working_hours))
    )
    .sort((a: Hospital, b: Hospital) => {
      const distanceA = calculateDistance(
        latitude as number,
        longitude as number,
        a.latitude as number,
        a.longitude as number
      );
      const distanceB = calculateDistance(
        latitude as number,
        longitude as number,
        b.latitude as number,
        b.longitude as number
      );
      return distanceA - distanceB;
    });

  const renderHospitalItem = ({ item }: { item: Hospital }) => (
    <TouchableOpacity
      style={styles.hospitalCard}
      onPress={() => navigation.navigate("HospitalDetails", { id: item._id })}
    >
      <Image
        source={{
          uri: item?.image?.imageUrl || "https://via.placeholder.com/300x200",
        }}
        style={styles.hospitalImage}
      />
      <Text style={styles.hospitalName}>{item.name}</Text>
      <View style={styles.ratingContainer}>
        <Feather name="star" size={16} color="#4CAF50" />
        <Text style={styles.ratingText}>
          {item?.reviews && item.reviews.length > 0
            ? (
                (item.reviews.reduce((sum, review) => sum + review.rating, 0) /
                  (item.reviews.length * 5)) *
                5
              ).toFixed(1)
            : "0"}
          /5
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Feather name="clock" size={16} color="#4CAF50" />
        <Text style={styles.infoText}>
          {isOpenNow(item.working_hours) ? "Open now" : "Closed"}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Feather name="phone" size={16} color="#4CAF50" />
        <Text style={styles.infoText}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Navbar />
      {/* <Text>{`${currentDay},time:${currentTime},todays:${todayHours?.opening_time},${todayHours?.opening_time}`}</Text> */}
      <ScrollView>
        <Header
          onBackClick={() => navigation.navigate("HostpitalTypes")}
          title="Hospitals"
        />
        <View style={styles.searchContainer}>
          <FormInput
            placeholder="Search hospitals..."
            value={searchTerm}
            OnChange={setSearchTerm}
            className={styles.searchInput}
            type="Search"
          />
          <Feather
            name="search"
            size={20}
            color="#4CAF50"
            style={styles.searchIcon}
          />
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Open Now</Text>
          <Switch
            value={filterOpenNow}
            onValueChange={setFilterOpenNow}
            trackColor={{ false: "#ffffff", true: "#38a169" }}
            thumbColor={filterOpenNow ? "#38a169" : "#38a169"}
          />
        </View>
        <View>
          {filteredAndSortedHospitals.map((hospital: Hospital) => (
            <View style={styles.listContainer} key={hospital._id}>
              {renderHospitalItem({ item: hospital })}
            </View>
          ))}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    backgroundColor: "#ffffff",
  },
  searchIcon: {
    position: "absolute",
    left: 10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterText: {
    marginRight: 8,
    color: "#4CAF50",
  },
  listContainer: {
    padding: 16,
  },
  hospitalCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0.2,
    elevation: 1,
  },
  hospitalImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: "#4CAF50",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    marginLeft: 4,
    color: "#4CAF50",
  },
});
