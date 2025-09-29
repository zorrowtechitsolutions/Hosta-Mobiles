import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { Phone, Calendar, MapPin, Droplet, Hash, Search, X } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import apiClient from "../Components/Axios";
import { errorToast, successToast } from "../Components/Toastify";
import { useDispatch } from "react-redux";
import { addBlood, setBloods } from "../Redux/BloodData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import countriesData from "world-countries";
import StatesCities from "../dummy/countries+states+cities.json";

// Type definitions
type City = {
  id: number;
  name: string;
  state_code?: string;
};

type State = {
  id: number;
  name: string;
  state_code: string;
  cities: City[];
};

type CountryData = {
  id: number;
  name: string;
  iso3: string;
  states: State[];
};

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "";
type FormData = {
  phone: string;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  place: string;
  pincode: string;
  lastDonationDate: string;
  country: string;
  state: string;
  district: string;
};

const BLOOD_GROUPS: Exclude<BloodGroup, "">[] = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",
];

// Searchable Dropdown Component
const SearchableDropdown = ({
  visible,
  onClose,
  title,
  data,
  onSelect,
  selectedValue,
  searchPlaceholder = "Search...",
}: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter((item : any)  =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  const handleSelect = (item : any) => {
    onSelect(item.id);
    onClose();
    setSearchQuery("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Search size={18} color="#66BB6A" />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  selectedValue === item.id && styles.selectedItem
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.dropdownItemText}>
                  {item.flag ? `${item.flag} ${item.name}` : item.name}
                </Text>
                {selectedValue === item.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const CreateDonor = ({ navigation } : any) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    dateOfBirth: "",
    bloodGroup: "",
    place: "",
    pincode: "",
    lastDonationDate: "",
    country: "",
    state: "",
    district: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLastDonationDatePicker, setShowLastDonationDatePicker] = useState(false);
  
  // Modal states
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showBloodGroupModal, setShowBloodGroupModal] = useState(false);

  // Country, State, District data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  // Type assertion for StatesCities
  const countriesStatesCities = StatesCities as CountryData[];

  // Blood groups formatted for dropdown
  const bloodGroupOptions = BLOOD_GROUPS.map(bg => ({
    id: bg,
    name: bg
  }));

  useEffect(() => {
    // Initialize countries from world-countries package
    const formattedCountries = countriesData.map((country) => ({
      id: country.cca3,
      name: country.name.common,
      flag: country.flag
    }));
    setCountries(formattedCountries);

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
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        phone: user.phone || ""
      }));
    }
  }, [user]);

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countriesStatesCities.find((country: CountryData) => 
        country.iso3 === formData.country || country.name === formData.country
      );
      
      if (selectedCountry && Array.isArray(selectedCountry.states)) {
        const stateOptions = selectedCountry.states.map((state: State) => ({
          id: state.state_code,
          name: state.name
        }));
        setStates(stateOptions);
      } else {
        setStates([]);
      }
      
      setFormData(prev => ({ ...prev, state: "", district: "" }));
      setDistricts([]);
    }
  }, [formData.country]);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state && formData.country) {
      const selectedCountry = countriesStatesCities.find((country: CountryData) => 
        country.iso3 === formData.country || country.name === formData.country
      );
      
      if (selectedCountry) {
        const selectedState = selectedCountry.states.find((state: State) => 
          state.state_code === formData.state || state.name === formData.state
        );
        
        if (selectedState && Array.isArray(selectedState.cities)) {
          const districtOptions = selectedState.cities.map((city: City) => ({
            id: city.id.toString(),
            name: city.name
          }));
          setDistricts(districtOptions);
        } else {
          setDistricts([]);
        }
      }
      
      setFormData(prev => ({ ...prev, district: "" }));
    }
  }, [formData.state, formData.country]);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("dateOfBirth", formatDate(selectedDate));
    }
  };


  // Helper function to get display name for selected values
  const getDisplayName = (data : any, value : any, defaultValue : any) => {
    if (!value) return defaultValue;
    const item = data.find((item : any) => item.id === value);
    return item ? (item.flag ? `${item.flag} ${item.name}` : item.name) : defaultValue;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be exactly 10 digits";

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.place) newErrors.place = "Place is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Pincode must be exactly 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Get country name from selected country ID
      const selectedCountry = countries.find(country => country.id === formData.country);
      const countryName = selectedCountry ? selectedCountry.name : formData.country;
      
      // Get state name from selected state ID
      const selectedState = states.find(state => state.id === formData.state);
      const stateName = selectedState ? selectedState.name : formData.state;
      
      // Get district name from selected district ID
      const selectedDistrict = districts.find(district => district.id === formData.district);
      const districtName = selectedDistrict ? selectedDistrict.name : formData.district;

      const payload = {
        phone: formData.phone.startsWith("0") ? formData.phone.slice(1) : formData.phone,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        address: { 
          place: formData.place, 
          pincode: Number(formData.pincode), 
          country: countryName, 
          state: stateName,
          district: districtName
        },
        userId: user._id,
      };
      

      const res = await apiClient.post("/api/donors", { newDonor: payload }, { withCredentials: true });
      const donorsRes = await apiClient.get("/api/donors");    
          dispatch(setBloods(donorsRes?.data?.donors));
      successToast("Donor created successfully!");
      navigation.goBack();

    } catch (err: any) {
      errorToast(err?.response?.data?.message || "Failed to create donor");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.header}>Register Blood Donor</Text>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Phone size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={formData.phone}
              onChangeText={(text) => handleChange("phone", text)}
              readOnly
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Date of Birth */}
          <TouchableOpacity 
            style={styles.inputGroup}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={18} color="#66BB6A" style={styles.icon} />
            <Text style={[styles.input, !formData.dateOfBirth && { color: '#A5D6A7' }]}>
              {formData.dateOfBirth || "Select Date of Birth"}
            </Text>
          </TouchableOpacity>
          {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
          
          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
       

          {/* Blood Group - Searchable */}
          <TouchableOpacity 
            style={styles.inputGroup}
            onPress={() => setShowBloodGroupModal(true)}
          >
            <Droplet size={18} color="#66BB6A" style={styles.icon} />
            <Text style={[styles.input, !formData.bloodGroup && { color: '#A5D6A7' }]}>
              {formData.bloodGroup || "Select Blood Group"}
            </Text>
          </TouchableOpacity>
          {errors.bloodGroup && <Text style={styles.errorText}>{errors.bloodGroup}</Text>}

          {/* Country Selection - Searchable */}
          <TouchableOpacity 
            style={styles.inputGroup}
            onPress={() => setShowCountryModal(true)}
          >
            <MapPin size={18} color="#66BB6A" style={styles.icon} />
            <Text style={[styles.input, !formData.country && { color: '#A5D6A7' }]}>
              {getDisplayName(countries, formData.country, "Select Country")}
            </Text>
          </TouchableOpacity>
          {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

          {/* State Selection - Searchable */}
          {formData.country && states.length > 0 && (
            <>
              <TouchableOpacity 
                style={styles.inputGroup}
                onPress={() => setShowStateModal(true)}
              >
                <MapPin size={18} color="#66BB6A" style={styles.icon} />
                <Text style={[styles.input, !formData.state && { color: '#A5D6A7' }]}>
                  {getDisplayName(states, formData.state, "Select State")}
                </Text>
              </TouchableOpacity>
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
            </>
          )}

          {/* District Selection - Searchable */}
          {formData.state && districts.length > 0 && (
            <>
              <TouchableOpacity 
                style={styles.inputGroup}
                onPress={() => setShowDistrictModal(true)}
              >
                <MapPin size={18} color="#66BB6A" style={styles.icon} />
                <Text style={[styles.input, !formData.district && { color: '#A5D6A7' }]}>
                  {getDisplayName(districts, formData.district, "Select District")}
                </Text>
              </TouchableOpacity>
              {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
            </>
          )}

          {/* Address - Place (manual input) */}
          <View style={styles.inputGroup}>
            <MapPin size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Place (Area/Locality)"
              value={formData.place}
              onChangeText={(text) => handleChange("place", text)}
            />
          </View>
          {errors.place && <Text style={styles.errorText}>{errors.place}</Text>}

          {/* Address - Pincode */}
          <View style={styles.inputGroup}>
            <Hash size={18} color="#66BB6A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="number-pad"
              value={formData.pincode}
              onChangeText={(text) => handleChange("pincode", text)}
              maxLength={6}
            />
          </View>
          {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.create]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Searchable Modals */}
      <SearchableDropdown
        visible={showBloodGroupModal}
        onClose={() => setShowBloodGroupModal(false)}
        title="Select Blood Group"
        data={bloodGroupOptions}
        onSelect={(value : any) => handleChange("bloodGroup", value)}
        selectedValue={formData.bloodGroup}
        searchPlaceholder="Search blood group..."
      />

      <SearchableDropdown
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        title="Select Country"
        data={countries}
        onSelect={(value : any) => handleChange("country", value)}
        selectedValue={formData.country}
        searchPlaceholder="Search country..."
      />

      <SearchableDropdown
        visible={showStateModal}
        onClose={() => setShowStateModal(false)}
        title="Select State"
        data={states}
        onSelect={(value : any) => handleChange("state", value)}
        selectedValue={formData.state}
        searchPlaceholder="Search state..."
      />

      <SearchableDropdown
        visible={showDistrictModal}
        onClose={() => setShowDistrictModal(false)}
        title="Select District"
        data={districts}
        onSelect={(value : any) => handleChange("district", value)}
        selectedValue={formData.district}
        searchPlaceholder="Search district..."
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECFDF5", padding: 16 },
  scrollView: { flexGrow: 1, justifyContent: "center" },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    backgroundColor: "#F1F8E9",
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 50,
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: "#2E7D32",
    paddingVertical: 12,
  },
  icon: { marginRight: 8 },
  errorText: { color: "#D32F2F", fontSize: 12, marginBottom: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  create: { backgroundColor: "#66BB6A", marginRight: 6 },
  cancel: { backgroundColor: "#E53935", marginLeft: 6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#2E7D32",
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#2E7D32",
  },
  selectedItem: {
    backgroundColor: "#F1F8E9",
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#66BB6A",
  },
});

export default CreateDonor;