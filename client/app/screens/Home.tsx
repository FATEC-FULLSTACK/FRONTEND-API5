import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PontoCRUD from "@/components/Pontos/PontoCRUD";
import Pontos from "./Pontos";
import NavFooter from "@/components/Nav/NavFooter";
import SearchLocation from "@/components/SearchLocation/SearchLocation";
import styles from "./HomeScreenStyles";

export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [isPontoCRUDVisible, setPontoCRUDVisible] = useState(false);
  const [isPontosModalVisible, setIsPontosModalVisible] = useState(false);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Nenhum token encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch("http://10.0.2.2:3000/ck", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        fetchPontos(data._id);
      } else {
        Alert.alert("Erro", data.message || "Erro ao buscar dados do usuário.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar os dados do usuário.");
    }
  };

  // Função para buscar pontos do usuário
  const fetchPontos = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Nenhum token encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch(`http://10.0.2.2:3000/user/${userId}/points`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const pontos = await response.json();
        setMarkers(pontos);
      } else {
        Alert.alert("Erro", "Erro ao buscar pontos.");
      }
    } catch (error) {
      console.error("Erro ao buscar pontos:", error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar os pontos.");
    }
  };

  // Função para obter a localização atual do aparelho
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de localização negada. Usando localização padrão.");
        setUserLocation({ lat: -23.5505, lng: -46.6333 }); // São Paulo como fallback
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.error("Erro ao obter a localização: ", error);
      setErrorMsg("Erro ao obter a localização. Usando localização padrão.");
      setUserLocation({ lat: -23.5505, lng: -46.6333 }); // Fallback caso dê erro
    }
  };

  useEffect(() => {
    requestLocationPermission();
    fetchUserData();
  }, []);

  const handleMapLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        apelido: "Novo Ponto",
        lat_long: { latitude, longitude },
        notificacoes: [],
      },
    ]);
  };

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setPontoCRUDVisible(true);
  };

  const handleSelectPonto = (ponto: any) => {
    setUserLocation({
      lat: ponto.lat_long.latitude,
      lng: ponto.lat_long.longitude,
    });
    setIsPontosModalVisible(false);
  };

  // Função chamada pelo componente SearchLocation para mover o mapa
  const handleLocationSelect = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
  };


  

  return (
    <View style={styles.container}>
      <View style={styles.HomeTitleContainer}>
        <Text style={styles.HomeTitle}>Kersys</Text>
        <FontAwesomeIcon name="bell" size={20} color="#FFFFFF" style={styles.notificationIcon} />
      </View>

      {/* Componente de busca de localização */}
      <SearchLocation onLocationSelect={handleLocationSelect} />

      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : userLocation ? (
        <MapView
          style={styles.map}
          region={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onLongPress={handleMapLongPress}
        >
          {markers.map((marker) => (
            <Marker
              key={marker._id}
              coordinate={{
                latitude: marker.lat_long.latitude,
                longitude: marker.lat_long.longitude,
              }}
              onPress={() => handleMarkerPress(marker)}
            >
              <Callout>
                <View style={styles.calloutView}>
                  <Text style={styles.calloutTitle}>Informações do Ponto</Text>
                  <Text>Latitude: {marker.lat_long.latitude}</Text>
                  <Text>Longitude: {marker.lat_long.longitude}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Carregando localização...</Text>
      )}

      <Modal
        visible={isPontosModalVisible}
        animationType="slide"
        onRequestClose={() => setIsPontosModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione um Ponto</Text>
          <Pontos
            pontos={markers}
            onSelectPonto={handleSelectPonto}
            closeModal={() => setIsPontosModalVisible(false)}
          />
          <TouchableOpacity
            style={styles.buttonCloseModal}
            onPress={() => setIsPontosModalVisible(false)}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {selectedMarker && (
        <PontoCRUD
          visible={isPontoCRUDVisible}
          onClose={() => setPontoCRUDVisible(false)}
          marker={selectedMarker}
        />
      )}

      <NavFooter
        focusedItem={focusedItem}
        onFocus={setFocusedItem}
        onSelectPontos={() => setIsPontosModalVisible(true)} // Modal de pontos será aberto pelo NavFooter
      />
    </View>
  );
}
