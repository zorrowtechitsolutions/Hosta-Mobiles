import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

export default function CustomHeader() {
    return (
      <View style={styles.header}>
        <StatusBar
          barStyle="light-content" // Use "dark-content" for dark icons/text
          backgroundColor="#28a745" // Matches the header background color
        />
      </View>
    );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#28a745",
    // borderBottomWidth: .5,
    // borderBottomColor: "#000",
  },
});
