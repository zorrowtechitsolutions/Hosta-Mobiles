import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Edit2 } from "lucide-react-native"; // smaller edit icon
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    picture: "https://i.pravatar.cc/300",
  });

  const [editableData, setEditableData] = useState({ ...user });
  const [userId, setUserId] = useState<String | null>(null);

  const getUser = async () => {
    const id = await AsyncStorage.getItem("userId");
    console.log(id);

    setUserId(id);
  };
  getUser();

  

  const handleEditToggle = () => {
    if (isEditing) {
      setUser(editableData);
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Section: Profile Picture + Edit Icon */}
      <View style={styles.topSection}>
        <Image source={{ uri: user.picture }} style={styles.avatar} />
        <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
          <Edit2 size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        {/* Name */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editableData.name}
            onChangeText={(text) =>
              setEditableData({ ...editableData, name: text })
            }
          />
        ) : (
          <Text style={styles.name}>{user.name}</Text>
        )}

        {/* Email */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editableData.email}
            onChangeText={(text) =>
              setEditableData({ ...editableData, email: text })
            }
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.infoText}>{user.email}</Text>
        )}

        {/* Phone */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editableData.phone}
            onChangeText={(text) =>
              setEditableData({ ...editableData, phone: text })
            }
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.infoText}>{user.phone}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#f5f6fa",
  },
  topSection: {
    position: "relative",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#007bff",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    elevation: 3,
  },
  infoContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
});
