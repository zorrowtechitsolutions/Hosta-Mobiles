import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import UserRegistration from "./Pages/Registration";
import UserLogin from "./Pages/Login";
import PasswordReset from "./Pages/PasswordReset";
import HospitalTypeCards from "./Pages/HospitalTypes";
import HospitalsPage from "./Pages/Hospitals";
import HospitalDetails from "./Pages/HospitalDetailes";
import DepartmentDoctorsPage from "./Pages/HospitalSpecialtiesDetails";
import DoctorsPage from "./Pages/Doctors";
import SpecialtiesPage from "./Pages/Specialties";
import AmbulanceServicesPage from "./Pages/Ambulance-services";
import CustomHeader from "./Components/CustomHeader";
const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: () => <CustomHeader />,
          cardStyle: { backgroundColor: "#fff" },
          presentation: "card",
        }}
      >
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="Register" component={UserRegistration} />
        <Stack.Screen name="Login" component={UserLogin} />
        <Stack.Screen name="PasswordReset" component={PasswordReset} />
        <Stack.Screen name="HostpitalTypes" component={HospitalTypeCards} />
        <Stack.Screen name="Hospitals" component={HospitalsPage} />
        <Stack.Screen name="HospitalDetails" component={HospitalDetails} />
        <Stack.Screen
          name="DepartmentDoctors"
          component={DepartmentDoctorsPage}
        />
        <Stack.Screen name="Doctors" component={DoctorsPage} />
        <Stack.Screen name="Specialties" component={SpecialtiesPage} />
        <Stack.Screen name="Ambulance" component={AmbulanceServicesPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
