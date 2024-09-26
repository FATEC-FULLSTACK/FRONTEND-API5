import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert, // Importando Alert
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permissão de localização negada");
          setErrorMsg("Permissão de localização negada");
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Erro ao obter a localização: ", error);
          setErrorMsg("Erro ao obter a localização");
          setUserLocation({ lat: -23.161, lng: -45.794 });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error("Erro na solicitação de permissão: ", error);
      setErrorMsg("Erro ao solicitar permissão");
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
            // limpar qualquer dado de usuário, se necessário
            router.push("/");
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    requestLocationPermission().catch((error) => {
      console.error("Erro ao executar requestLocationPermission: ", error);
      setErrorMsg("Erro ao solicitar permissão de localização");
    });
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <Text>
          Localização do usuário:{" "}
          {userLocation
            ? `${userLocation.lat}, ${userLocation.lng}`
            : "Carregando..."}
        </Text>
      )}
      <View style={styles.navbar}>
        <View style={styles.navItem}>
          <Text onPress={handleLogout} style={styles.actions}>
            Logout
          </Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.actions}>Opções</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.actions}>Ações</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    borderColor: "rgb(160, 160, 160)",
    borderTopWidth: 1,
    width: "100%",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 0.2,
    borderColor: "rgb(160, 160, 160)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#066E3A",
  },
  actions: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#066E3A",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});
