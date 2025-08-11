import { configureStore } from "@reduxjs/toolkit";
import userRegistrationReducer from "./UserRegistration";
import userLoginSlice from "./UserData";
import hospitalSlice from "./HospitalsData";
import ambulaceData from "./AmbulanceData";

export const store = configureStore({
  reducer: {
    userRegistration: userRegistrationReducer,
    userLogin: userLoginSlice,
    hospitalData: hospitalSlice,
    ambulanceData: ambulaceData,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
