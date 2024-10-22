import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Clipboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import { GOOGLE_API_KEY } from "@/config"; 
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

interface Coordinates {
  lat: number;
  lng: number;
}

const GeocodingScreen: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusedItem, setFocusedItem] = useState(null);
  const navigation = useNavigation();
  

  const handleFocus = (item: any) => {
    setFocusedItem(item);
  };

  const fetchCoordinates = async () => {
    try {
      const API_KEY = GOOGLE_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ lat, lng });
        setError(null); // Limpar erro, se houver
      } else {
        setError("Localização não encontrada.");
      }
    } catch (err) {
      setError("Erro ao buscar coordenadas.");
    }
  };

  const copyToClipboard = () => {
    if (coordinates) {
      Clipboard.setString(` ${coordinates.lat}, ${coordinates.lng}`);
      alert("Coordenadas copiadas para o clipboard!");
    }
  };

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
          onPress: () => {
            router.push("/");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      

        <TextInput
          style={styles.input}
          placeholder="Digite uma região (ex: São Paulo)"
          value={location}
          onChangeText={setLocation}
        />
        

        <TouchableOpacity
          style={styles.searchButton}
          onPress={fetchCoordinates}
        >
          <Text style={styles.searchButtonText}>Buscar Coordenadas</Text>
        </TouchableOpacity>

        {coordinates && (
          <View style={styles.resultContainer}>
            <View style={styles.result}>
              <Text>{coordinates.lat}</Text>
              <Text>{coordinates.lng}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyToClipboard}
            >
              <Text style={styles.copyButtonText}>Copiar Coordenadas</Text>
            </TouchableOpacity>
          </View>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[
            styles.navItem,
            focusedItem === "logout" && styles.focusedItem,
          ]}
          onPress={() => {
            handleFocus("logout");
            handleLogout();
          }}
        >
          <Icon name="logout" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            focusedItem === "localidade" && styles.focusedItem,
          ]}
          onPress={() => {
            handleFocus("localidade");
            navigation.navigate("screens/Coordenadas");
          }}
        >
          <Icon name="public" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Localidade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            focusedItem === "settings" && styles.focusedItem,
          ]}
          onPress={() => handleFocus("settings")}
        >
          <Icon name="settings" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Opções</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            focusedItem === "actions" && styles.focusedItem,
          ]}
          onPress={() => {
            handleFocus("actions");
            navigation.navigate("screens/Pontos");
            /* navigation.navigate("screens/UserInfo"); */
          }}
        >
          <Icon name="place" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Pontos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  searchButton: {
    backgroundColor: "#066E3A",
    borderRadius: 7,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 7,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  result: {
    marginBottom: 20,
  },
  copyButton: {
    backgroundColor: "#005BB5", // Azul escuro
    borderRadius: 7,
    padding: 10,
    alignItems: "center",
    marginTop: 20
  },
  copyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    marginTop: 20,
    color: "red",
  },
  contentContainer: {
    height: "85%",
    marginTop: 50,
  },
  focusedItem: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#66BB6A",
    borderRadius: 5,
    paddingBottom: 5,
  },
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
    color: "white",
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  navbarText: {
    color: "#066E3A",
    fontSize: 12.5,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  result: {
    marginTop: 20,
  },
  error: {
    marginTop: 20,
    color: "red",
  },
});

export default GeocodingScreen;
