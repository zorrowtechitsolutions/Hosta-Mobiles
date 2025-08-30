import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Redux/UserData";
import { RootState } from "../Redux/Store";
import { apiClient } from "./Axios";
import { Menu, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavItemProps = {
  to: string;
  children: React.ReactNode;
  onPress?: () => void;
  isActive?: boolean;
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

// NavItem component
const NavItem = ({ to, children, onPress, isActive }: NavItemProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) onPress();
    navigation.navigate(to as never);
  };

  return (
    <TouchableOpacity
      style={isActive ? styles.activeButton : styles.button}
      onPress={handlePress}
    >
      <Text style={isActive ? styles.activeText : styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

// MobileMenu component
const MobileMenu = ({ isOpen, onClose, children }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <Modal transparent animationType="slide" visible={isOpen}>
      <View style={styles.mobileMenu}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#2F855A" />
        </TouchableOpacity>
        <View>{children}</View>
      </View>
    </Modal>
  );
};

// Main Navbar Component
export default function Navbar() {
  const { _id } = useSelector((state: RootState) => state.userLogin);
  const dispatch = useDispatch();
  const route = useRoute();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "Home" },
    { name: "About", path: "About" },
    { name: "Contact", path: "Contact" },
    { name: "Settings", path: "Settings" },
  ];

  const handleLogout = async () => {
    try {
      await apiClient.get("/api/logout", { withCredentials: true });
      await AsyncStorage.removeItem("accessToken");
      dispatch(logoutUser());
      setIsMobileMenuOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>Hosta</Text>
      <View style={styles.desktopNav}>
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            to={item.path}
            isActive={route.name === item.path}
          >
            {item.name}
          </NavItem>
        ))}
        {_id ? (
          <NavItem
            to="Home"
            onPress={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </NavItem>
        ) : (
          <NavItem to="Login">Login</NavItem>
        )}
      </View>
      <TouchableOpacity
        style={styles.mobileMenuButton}
        onPress={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={24} color="white" />
      </TouchableOpacity>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            to={item.path}
            isActive={route.name === item.path}
            onPress={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </NavItem>
        ))}
        {_id ? (
          <NavItem
            to="Home"
            onPress={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </NavItem>
        ) : (
          <NavItem to="Login" onPress={() => setIsMobileMenuOpen(false)}>
            Login
          </NavItem>
        )}
      </MobileMenu>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#28a745",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  desktopNav: {
    flexDirection: "row",
    alignItems: "center",
    display: "none", // Visible for larger screens
  },
  navItem: {
    marginHorizontal: 8,
    paddingVertical: 8,
  },
  activeNavItem: {
    fontWeight: "bold",
    color: "#f0fff4",
  },
  navText: {
    color: "white",
    fontSize: 16,
  },
  activeNavText: {
    fontWeight: "bold",
    color: "#f0fff4",
  },
  usernameMobile: {
    color: "white",
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },

  profileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "white",
    marginHorizontal: 4,
  },
  mobileMenuButton: {
    display: "flex",
  },
  mobileMenu: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    width: 200,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  logoutText: {
    marginLeft: 8,
    color: "red",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  button: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeButton: {
    padding: 10,
    backgroundColor: "#28a745",
    color: "white",
    borderRadius: 8,
    alignItems: "center",
    margin: 10,
  },
  text: {
    color: "#2F855A",
    fontSize: 16,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
