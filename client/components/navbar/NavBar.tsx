import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const NavBar = ({ handleLogout }) => {
  const [focusedItem, setFocusedItem] = useState(null);
  const navigation = useNavigation();  // Para navegação

  const handleFocus = (item) => {
    setFocusedItem(item);
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navItem, focusedItem === "logout" && styles.focusedItem]}
        onPress={() => {
          handleFocus("logout");
          handleLogout();
        }}
      >
        <Icon name="logout" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, focusedItem === "localidade" && styles.focusedItem]}
        onPress={() => {
          handleFocus("localidade");
          navigation.navigate("screens/Coordenadas");
        }}
      >
        <Icon name="public" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Localidade</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, focusedItem === "settings" && styles.focusedItem]}
        onPress={() => handleFocus("settings")}
      >
        <Icon name="settings" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Opções</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, focusedItem === "actions" && styles.focusedItem]}
        onPress={() => {
          handleFocus("actions");
          navigation.navigate("screens/Pontos");
        }}
      >
        <Icon name="place" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Pontos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    padding: 5,
    width: "100%",
    height: 80,
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  focusedItem: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#66BB6A",
    borderRadius: 5,
    paddingBottom: 5,
  },
  navbarText: {
    color: "#066E3A",
    fontSize: 12.5,
    fontWeight: "bold",
  },
});

export default NavBar;
