import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps"; // Importando o MapView
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const defaultLocation = { lat: -23.5505, lng: -46.6333 };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de localização negada");
        setErrorMsg("Permissão de localização negada");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.error("Erro ao obter a localização: ", error);
      setErrorMsg("Erro ao obter a localização");
      setUserLocation(defaultLocation);
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
      ) : userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: defaultLocation.lat, 
            longitude: defaultLocation.lng, 
            latitudeDelta: 0.0922, 
            longitudeDelta: 0.0421, 
          }}
        >
          {/* Adicionando um marcador na localização do usuário */}
          <Marker
            coordinate={{
              latitude: userLocation ? userLocation.lat : defaultLocation.lat, 
              longitude: userLocation ? userLocation.lng : defaultLocation.lng,
            }}
            title="Você está aqui"
          />
        </MapView>
      ) : (
        <Text>Carregando localização...</Text>
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
  map: {
    width: "100%",
    height: "91%", 
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
