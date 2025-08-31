import React, { useState, useMemo, useCallback, useState as useReactState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Phone } from "lucide-react-native";
import Navbar from "../Components/Navbar";
import { Header } from "../Components/Common";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import LoadingSpinner from "../Components/LoadingSpinner";
import { setBloods } from "../Redux/BloodData";
import apiClient from "../Components/Axios";
import { useFocusEffect } from "@react-navigation/native";

export interface IBloodDonor {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  phone: string;
  dateOfBirth: string;
  bloodGroup: "O+" | "O-" | "AB+" | "AB-" | "A+" | "A-" | "B+" | "B-";
  address: { place: string; pincode: number };
  lastDonationDate?: string | null;
  profileImage?: string;
}

const bloodGroups: (IBloodDonor["bloodGroup"] | "All")[] = [
  "All","O+","O-","A+","A-","B+","B-","AB+","AB-",
];

const calculateAge = (dob: string) => {
  const b = new Date(dob);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
};
const getInitial = (name: string) => (name?.trim()?.charAt(0) || "?").toUpperCase();

const BloodDonorsPage = ({ navigation }: { navigation: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<IBloodDonor["bloodGroup"] | "All">("All");
  const [loading, setLoading] = useReactState(true);
  const [refreshing, setRefreshing] = useReactState(false);

  const dispatch = useDispatch();
  const donors = useSelector((state: RootState) => state.bloodData) as IBloodDonor[];

  const donorsWithId: IBloodDonor[] = (donors ?? []).map((d, index) => ({
    ...d,
    id: d.id || String(index),
  }));

  const fetchDonors = async () => {
    try {
      const res = await apiClient.get("/api/donors", { withCredentials: true });
      const list = res?.data?.donors ?? res?.data ?? [];
      dispatch(setBloods(list)); // merges with existing (optimistic item kept)
    } catch (e) {
      console.error("Failed to fetch donors", e);
    }
  };

  // Initial + on-screen-focus refetch
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        await fetchDonors();
        if (mounted) setLoading(false);
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDonors();
    setRefreshing(false);
  }, []);

  const filteredDonors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return donorsWithId.filter((d) => {
      const matchesSearch =
        q.length === 0 ||
        d.userId?.name?.toLowerCase()?.includes(q) ||
        d.phone?.includes(q) ||
        d.address?.place?.toLowerCase()?.includes(q);
      const matchesGroup = selectedGroup === "All" ? true : d.bloodGroup === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchTerm, selectedGroup, donorsWithId]);

  if (loading) return <LoadingSpinner />;

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  const renderChip = ({ item }: { item: IBloodDonor["bloodGroup"] | "All" }) => {
    const active = selectedGroup === item;
    return (
      <TouchableOpacity
        onPress={() => setSelectedGroup(item)}
        style={[styles.chip, active && styles.chipActive]}
        activeOpacity={0.7}
      >
        <Text allowFontScaling={false} style={[styles.chipText, active && styles.chipTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDonor = ({ item }: { item: IBloodDonor }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text allowFontScaling={false} style={styles.avatarInitial}>
              {getInitial(item?.userId?.name)}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item?.userId?.name} ({calculateAge(item.dateOfBirth)} yrs)
            </Text>
            <View style={styles.bloodBadge}>
              <Text allowFontScaling={false} style={styles.bloodBadgeText}>
                {item.bloodGroup}
              </Text>
            </View>
          </View>
          <Text style={styles.info} numberOfLines={1}>
            Location: {item.address.place}
          </Text>
          <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(item.phone)}>
            <Phone size={16} color="#FFF" />
            <Text style={styles.callBtnText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Navbar />
      <Header onBackClick={() => navigation.navigate("Home")} title="Blood Services" />

      <View style={styles.searchBar}>
        <Icon name="search" size={18} color="#388E3C" style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { marginRight: 8 }]}
          placeholder="Search donors..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.donateBtn} onPress={() => navigation.navigate("Donate")}>
          <Text style={styles.donateBtnText}>Donate</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={bloodGroups}
        keyExtractor={(g) => g}
        renderItem={renderChip}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      />

      <FlatList
        data={filteredDonors}
        keyExtractor={(item) => item.id}
        renderItem={renderDonor}
        ListEmptyComponent={<Text style={styles.empty}>No donors found.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 16,
          paddingTop: 12,
          flexGrow: 1,
          justifyContent: "flex-start",
        }}
      />
    </View>
  );
};

export default BloodDonorsPage;

const GREEN = "#388E3C";
const GREEN_DARK = "#2E7D32";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ECFDF5" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
    marginHorizontal: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  searchInput: { flex: 1, height: "100%" },
  donateBtn: { backgroundColor: GREEN, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  donateBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  chipsRow: { paddingHorizontal: 12, paddingBottom: 8 },
  chip: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: GREEN,
    marginRight: 10, justifyContent: "center", alignItems: "center",
    backgroundColor: "#E8F5E9", marginBottom: 30,
  },
  chipActive: { backgroundColor: GREEN_DARK, borderColor: GREEN_DARK },
  chipText: { color: GREEN, fontWeight: "700", fontSize: 14, textAlign: "center" },
  chipTextActive: { color: "#FFF" },
  card: { backgroundColor: "#FFF", borderRadius: 12, marginBottom: 12, padding: 12, elevation: 2 },
  cardRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  avatarPlaceholder: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: "#A5D6A7",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  avatarInitial: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { flex: 1, color: GREEN, fontWeight: "bold", fontSize: 16, marginRight: 10 },
  info: { color: "#616161", fontSize: 14, marginTop: 2 },
  bloodBadge: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#E53935",
    justifyContent: "center", alignItems: "center",
  },
  bloodBadgeText: { color: "#FFF", fontWeight: "bold", fontSize: 12, textAlign: "center" },
  callBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: GREEN,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 24, marginTop: 8, alignSelf: "flex-start",
  },
  callBtnText: { color: "#FFF", marginLeft: 6, fontWeight: "600" },
  empty: { textAlign: "center", color: "#616161", marginTop: 24 },
});
