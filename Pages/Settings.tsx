// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { Edit2 } from "lucide-react-native";
// import apiClient from "../Components/Axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useSelector } from "react-redux";
// import { RootState } from "../Redux/Store";
// import { updateUserData } from "../Redux/UserData";
// import { errorToast, successToast } from "../Components/Toastify";
// import { useDispatch } from "react-redux";

// export default  function Profile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editableData, setEditableData] = useState<any>({});
//     const dispatch = useDispatch();

//   const { phone, _id, email, name } = useSelector(
//     (state: RootState) => state.userLogin
//   );
//   const [user, setUser] = useState<any>({
//     phone,
//     name,
//     email,
//     picture : ""
//   });

//   const handleEditToggle = async () => {
//     if (isEditing) {
//       setUser(editableData); // save changes locally
//     }

//        try {
//       const result = await apiClient.post(
//         `/api/users/${_id}`,
//         {  },
//         { withCredentials: true }
//       );

//       successToast("Pofile edit successful");
//       dispatch(updateUserData(result.data.userDetails));
//     setIsEditing(!isEditing);
//     } catch (err: any) {
//       errorToast(err.response || "Profile not ");

//     }
//   };

//   // sync editableData when user changes
//   useEffect(() => {
//     if (user) {
//       setEditableData(user);
//     }
//   }, [user]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Top Section: Profile Picture + Edit Icon */}
//       <View style={styles.topSection}>
//         <Image
//           source={{
//             uri:
//               user?.picture ||
//               "https://i.pravatar.cc/300?u=default", // ✅ fallback avatar
//           }}
//           style={styles.avatar}
//         />
//         <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
//           <Edit2 size={24} color="#007bff" />
//         </TouchableOpacity>
//       </View>

//       {/* Profile Info */}
//       <View style={styles.infoContainer}>
//         {/* Name */}
//         {isEditing ? (
//           <TextInput
//             style={styles.input}
//             value={editableData?.name || ""}
//             onChangeText={(text) =>
//               setEditableData({ ...editableData, name: text })
//             }
//           />
//         ) : (
//           <Text style={styles.name}>{user?.name }</Text>
//         )}

//         {/* Email */}
//         {isEditing ? (
//           <TextInput
//             style={styles.input}
//             value={editableData?.email  || ""}
//             onChangeText={(text) =>
//               setEditableData({ ...editableData, email: text })
//             }
//             keyboardType="email-address"
//           />
//         ) : (
//           <Text style={styles.infoText}>{user?.email}</Text>
//         )}

//         {/* Phone */}
//         {isEditing ? (
//           <TextInput
//             style={styles.input}
//             value={editableData?.phone  || ""}
//             onChangeText={(text) =>
//               setEditableData({ ...editableData, phone: text })
//             }
//             keyboardType="phone-pad"
//           />
//         ) : (
//           <Text style={styles.infoText}>{user?.phone}</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     alignItems: "center",
//     paddingVertical: 40,
//     backgroundColor: "#f5f6fa",
//   },
//   topSection: {
//     position: "relative",
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: "#007bff",
//   },
//   editIcon: {
//     position: "absolute",
//     bottom: 0,
//     right: 10,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 5,
//     elevation: 3,
//   },
//   infoContainer: {
//     width: "90%",
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 5,
//     alignItems: "center",
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#333",
//     marginBottom: 10,
//   },
//   infoText: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 10,
//   },
//   input: {
//     width: "100%",
//     fontSize: 16,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     marginBottom: 10,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import apiClient from "../Components/Axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/Store";
import { updateUserData } from "../Redux/UserData";
import { errorToast, successToast } from "../Components/Toastify";
import { getInitial } from "./Blood";
import { Delete, Edit2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<any>({});
  const [donor, setDonor] = useState<any>(null);
  const dispatch = useDispatch();

  // const { phone, _id, email, name, picture } = useSelector(
  //   (state: RootState) => state.userLogin
  // );



  const [user, setUser] = useState<any>(null);

  const handleSave = async () => {
    try {
      const name = editableData?.name;

      const result = await apiClient.put(
        `/api/users/${user?._id}`,
        { name },
        {
          withCredentials: true,
        }
      );

      successToast("Profile updated successfully");
      dispatch(updateUserData(result.data.user));
      setUser(result.data.user);
      setIsEditing(false);
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Profile update failed");
    }
  };



useEffect(() => {
  const fetchUser = async () => {
    try {
      const _id = await AsyncStorage.getItem("userId");
      if (!_id) return;                      

      const result = await apiClient.get(`/api/users/${_id}`);
      
      setUser(result.data.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };
  fetchUser();
}, []); // run once


useEffect(() => {
  if (!user?._id) return;                    

  const fetchDonor = async () => {
    try {
      const result = await apiClient.get(`/api/donors/users/${user._id}`);
      setDonor(result.data);
    } catch (err) {
      console.error("Failed to fetch donor", err);
    }
  };
  fetchDonor();
}, [user?._id]); // only when id changes


    const handleDelete = async (id: any) => {
    try {
      await apiClient.delete(`/api/donors/${id}`);
      setDonor(null);
      successToast("Donor delete successfully");
    } catch (error) {
      console.error("Failed to delete donor", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Image */}
      <TouchableOpacity style={styles.topSection}>
        <View style={styles.avatarPlaceholder}>
          <Text allowFontScaling={false} style={styles.avatarInitial}>
            {getInitial(user?.name as string)}
          </Text>
        </View>
        {/* <View style={styles.editIcon}>
          <Edit2 size={20} color="#007bff" />
        </View> */}
      </TouchableOpacity>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        {!isEditing && (
          <View style={styles.editIcon}>
            <Edit2
              onPress={() => setIsEditing(true)}
              size={20}
              color="#007bff"
            />
          </View>
        )}

        {/* Name */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editableData?.name || ""}
            onChangeText={(text) =>
              setEditableData({ ...editableData, name: text })
            }
          />
        ) : (
          <Text style={styles.name}>{user?.name}</Text>
        )}

        {/* Email & Phone (read-only) */}
        <Text style={styles.infoText}>{user?.email}</Text>
        <Text style={styles.infoText}>{user?.phone}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {
          isEditing && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          )

          // <TouchableOpacity
          //   style={styles.editBtn}
          //   onPress={() => setIsEditing(true)}
          // >
          //   <Text style={styles.btnText}>Edit Profile</Text>
          // </TouchableOpacity>
          // )
        }
      </View>

      {donor && (
        <View style={styles.bloodContainer}>
          <View style={styles.editIcon}>
            <Delete
              onPress={() => handleDelete(donor._id)}
              size={20}
              color="#007bff"
            />
          </View>
          <Text style={styles.sectionTitle}>Blood Information</Text>

          <View style={styles.bloodRow}>
            <Text style={styles.label}>Blood Group:</Text>
            <Text style={styles.value}>{donor?.bloodGroup}</Text>
          </View>

          <View style={styles.bloodRow}>
            <Text style={styles.label}>Born:</Text>
            <Text style={styles.value}>
              {donor?.dateOfBirth
                ? new Date(donor.dateOfBirth).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </Text>
          </View>

          <View style={styles.bloodRow}>
            <Text style={styles.label}>Place:</Text>
            <Text style={styles.value}>{donor?.address.place}</Text>
          </View>

          <View style={styles.bloodRow}>
            <Text style={styles.label}>Pin code:</Text>
            <Text style={styles.value}>{donor?.address.pincode}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#ECFDF5",
  },
  topSection: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#007bff",
  },
  editIcon: {
    position: "absolute",
    top: 0,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  infoContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 15,
    elevation: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  // avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#A5D6A7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarInitial: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
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
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  editBtn: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  bloodContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 50,
    borderRadius: 15,
    elevation: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  bloodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
