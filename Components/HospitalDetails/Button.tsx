import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const Button = ({
  activeTab,
  purpose,
  content,
  OnClick,
}: {
  activeTab?: string;
  purpose?: string;
  content?: string;
  OnClick?: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, activeTab === purpose && styles.activeButton]}
      onPress={OnClick}
    >
      <Text
        style={[
          styles.buttonText,
          activeTab === purpose && styles.activeButtonText,
        ]}
      >
        {content}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeButton: {
    borderBottomColor: "green",
  },
  buttonText: {
    color: "green",
    fontSize: 16,
    fontWeight: "500",
  },
  activeButtonText: {
    color: "darkgreen",
  },
});