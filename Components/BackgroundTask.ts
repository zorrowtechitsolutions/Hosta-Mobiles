import apiClient from "./Axios";
import { setHospitalData } from "../Redux/HospitalsData";
import { getCurrentLocation } from "./GetCurrentLocation";
import { updateUserData } from "../Redux/UserData";
import { setAmbulances } from "../Redux/AmbulanceData";
import { setBloods } from "../Redux/BloodData";

export const getData = async (dispatch: any) => {
  try {
    const [lat, lon] = (await getCurrentLocation()) as [number, number];
    dispatch(
      updateUserData({ latitude: lat as number, longitude: lon as number })
    );

    const result = await apiClient.get("/api/hospitals");
    dispatch(setHospitalData({ data: result.data.data }));

    const ambulances = await apiClient.get("/api/ambulances");
    dispatch(setAmbulances(ambulances.data.data));

    const donorsRes = await apiClient.get("/api/donors");
    dispatch(setBloods(donorsRes.data.donors));

    const user = await apiClient.get("/api/users", {
      withCredentials: true,
    });
    const { email, name, phone, password, _id } = user.data.data;
    dispatch(
      updateUserData({
        email,
        name,
        password,
        phone,
        _id: _id as string,
      })
    );

    

  } catch (err) {
    console.error(err);
  }
};
