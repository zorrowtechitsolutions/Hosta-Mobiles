import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Hospital } from "../../Redux/HospitalsData";

export const Specialties = ({
  hospital,
  navigation,
}: {
  hospital: Hospital;
  navigation: any;
}) => {
  return (
    <View style={styles.container}>
      {hospital?.specialties.map((dept, index) => (
        <TouchableOpacity
          key={index}
          style={styles.specialtyCard}
          onPress={() =>
            navigation.navigate("DepartmentDoctors", {
              hospitalId: hospital?._id,
              departmentId: dept._id,
            })
          }
        >
          <Text style={styles.specialtyName}>{dept.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  specialtyCard: {
    borderWidth: 1,
    borderColor: "darkgreen",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#f8fdf8",
  },
  specialtyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "darkgreen",
    marginBottom: 4,
  },
  specialtyInfo: {
    fontSize: 16,
    color: "green",
  },
});
