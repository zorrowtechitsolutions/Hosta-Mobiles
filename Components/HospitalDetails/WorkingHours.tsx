import { Calendar } from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Hospital } from "../../Redux/HospitalsData";

export function convertTo12HourFormat(time24: string): string {
  let [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export const WorkingHours = ({ hospital }: { hospital: Hospital }) => {
  return (
    <View style={styles.container}>
      {hospital.working_hours.map((day, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.dayRow}>
            <Calendar color="green" width={18} height={18} />
            <Text style={styles.dayText}>{day.day}</Text>
          </View>
          <Text style={styles.hoursText}>
            {day.is_holiday
              ? "Holiday"
              : `${convertTo12HourFormat(
                  day.opening_time
                )} - ${convertTo12HourFormat(day.closing_time)}`}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgreen",
    paddingVertical: 8,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "darkgreen",
  },
  hoursText: {
    fontSize: 16,
    color: "green",
  },
});
