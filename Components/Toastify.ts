import Toast from "react-native-toast-message";

/**
 * Displays an error toast message.
 */
export const errorToast = (message: string) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    visibilityTime: 5000,
    position: "top",
    autoHide: true,
    topOffset: 50,
  });
};

/**
 * Displays a success toast message.
 */
export const successToast = (message: string) => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    visibilityTime: 5000,
    position: "top",
    autoHide: true,
    topOffset: 50,
  });
};

/**
 * Displays an informational toast message.
 */
export const infoToast = (message: string) => {
  Toast.show({
    type: "info",
    text1: "Information",
    text2: message,
    visibilityTime: 5000,
    position: "top",
    autoHide: true,
    topOffset: 50,
  });
};
