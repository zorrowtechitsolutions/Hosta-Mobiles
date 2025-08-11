import * as Location from "expo-location";

export const getCurrentLocation = async () => {
  try {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    // Get the current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return [location.coords.latitude, location.coords.longitude];
  } catch (error) {
    console.error("Error getting user location:", error);
    alert("Please enable location service");
    // throw error;
  }
};
