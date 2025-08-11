import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Hospital } from "../Redux/HospitalsData";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = ({ hospital }: { hospital: Hospital }) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.userLogin
  ) as { latitude: number; longitude: number };

  const hospitalLocation = {
    latitude: hospital?.latitude as number,
    longitude: hospital?.longitude as number,
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        setUserLocation({ latitude, longitude });
      } catch (error) {
        console.error("Error getting user location:", error);
        setErrorMessage(
          "Unable to fetch your location. Please enable location services."
        );
      } finally {
        setIsLoading(false);
      }
    };
    getLocation();
  }, [latitude, longitude]);

  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.fitToCoordinates([userLocation, hospitalLocation], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [userLocation, hospitalLocation]);

  const openGoogleMaps = () => {
    const destination = `${hospitalLocation.latitude},${hospitalLocation.longitude}`;
    const url = Platform.select({
      ios: `maps://app?daddr=${destination}`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
    });
    if (url) {
      Linking.openURL(url).catch(() =>
        Alert.alert("Error", "Failed to open maps")
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#dc3545" />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setIsLoading(true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...hospitalLocation,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker
          coordinate={hospitalLocation}
          title={hospital.name}
          description={hospital.address}
          pinColor="#28a745"
        >
          <MaterialIcons name="local-hospital" size={30} color="#28a745" />
        </Marker>
        {userLocation && (
          <>
            <Marker
              coordinate={userLocation}
              title="Your Location"
              pinColor="#007bff"
            >
              <MaterialIcons
                name="person-pin-circle"
                size={30}
                color="#007bff"
              />
            </Marker>
            <Polyline
              coordinates={[userLocation, hospitalLocation]}
              strokeColor="#007bff"
              strokeWidth={3}
            />
          </>
        )}
      </MapView> */}
      <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
        <MaterialIcons name="directions" size={24} color="#fff" />
        <Text style={styles.buttonText}>Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#28a745",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Map;
