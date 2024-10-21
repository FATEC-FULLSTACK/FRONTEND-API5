import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import styles from "./NavFooterStyles";

interface NavFooterProps {
  focusedItem: string | null;
  onFocus: (item: string | null) => void;
  onSelectPontos: () => void; // Função que abre o modal de pontos
}

const NavFooter: React.FC<NavFooterProps> = ({ focusedItem, onFocus, onSelectPontos }) => {
  const navigation = useNavigation(); // Para navegar para outras telas

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Você tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken"); // Remove o token do AsyncStorage
              navigation.navigate("index"); // Navega para a tela de login
            } catch (error) {
              console.error("Erro ao remover token:", error);
              Alert.alert("Erro", "Não foi possível fazer o logout.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navItem, focusedItem === "home" && styles.focusedItem]}
        onPress={() => {
          onFocus("home");
          navigation.navigate('screens/Home'); // Navega para a tela Home
        }}
      >
        <Icon name="home" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Home</Text>
      </TouchableOpacity>

   {/*    <TouchableOpacity
        style={[styles.navItem, focusedItem === "localidade" && styles.focusedItem]}
        onPress={() => {
          onFocus("localidade");
          navigation.navigate('Localidade'); // Navega para a tela Localidade
        }}
      >
        <Icon name="public" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Localidade</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={[styles.navItem, focusedItem === "pontos" && styles.focusedItem]}
        onPress={onSelectPontos} // Abre o modal de pontos
      >
        <Icon name="place" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Pontos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, focusedItem === "settings" && styles.focusedItem]}
        onPress={() => {
          onFocus("settings");
          //navigation.navigate('Settings'); // Navega para a tela Configurações
        }}
      >
        <Icon name="settings" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Opções</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, focusedItem === "logout" && styles.focusedItem]}
        onPress={() => {
          onFocus("logout");
          handleLogout(); // Chama a função de logout
        }}
      >
        <Icon name="logout" size={25} color="#066E3A" />
        <Text style={styles.navbarText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavFooter;
