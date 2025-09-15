import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./Redux/Store";
import Toast from "react-native-toast-message";
import Routes from "./Routes";
import * as SplashScreen from "expo-splash-screen";
import { Text } from "react-native";

SplashScreen.preventAutoHideAsync();
const App = () => {
  useEffect(() => {
    const prepareApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };
    prepareApp();
  }, []);

  return (
    <Provider store={store}>
      {Routes ? <Routes /> : <Text>Loading...</Text>}
      <Toast />
    </Provider>
  );
};

export default App;
