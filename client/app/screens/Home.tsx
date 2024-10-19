import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PontoCRUD from "@/components/Pontos/PontoCRUD";

export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [focusedItem, setFocusedItem] = useState(null);
  const [search, setSearch] = useState("");

  const navigation = useNavigation();

  const handleFocus = (item: any) => {
    setFocusedItem(item);
  };

  // Função para buscar o usuário conectado
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
      } else {
        Alert.alert("Erro", data.message || "Erro ao buscar dados do usuário.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar os dados do usuário.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const defaultLocation = { lat: -23.5505, lng: -46.6333 };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
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

  useEffect(() => {
    requestLocationPermission().catch((error) => {
      console.error("Erro ao solicitar permissão de localização: ", error);
    });
  }, []);

  // Função chamada ao clicar e segurar no mapa
  const handleMapLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        apelido: "Novo Ponto", // Default value for apelido
        lat_long: { latitude, longitude },
        notificacoes: [],
      },
    ]);
  };

  // Função para abrir o modal de edição ao clicar em um marcador
  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };
  // Função para deletar o ponto
  const handleDeleteMarker = async (marker: any) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Nenhum token encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch(`http://10.0.2.2:3000/user/${userData._id}/ponto/${marker._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMarkers((prevMarkers) => prevMarkers.filter((m) => m !== marker));
        setModalVisible(false); // Fechar modal após deletar
      } else {
        Alert.alert("Erro", "Erro ao deletar o ponto.");
      }
    } catch (error) {
      console.error("Erro ao deletar o ponto:", error);
      Alert.alert("Erro", "Ocorreu um erro ao deletar o ponto.");
    }
  };

  // Função para salvar o ponto
  const handleSaveMarker = async (updatedMarker: any) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Nenhum token encontrado. Faça login novamente.");
        return;
      }

      // Fazendo a requisição para salvar o ponto no backend
      const response = await fetch(`http://10.0.2.2:3000/user/${userData._id}/ponto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          apelido: updatedMarker.apelido,
          lat_long: updatedMarker.lat_long,
          notificacoes: updatedMarker.notificacoes,
        }),
      });

      if (response.ok) {
        setMarkers((prevMarkers) =>
          prevMarkers.map((m) =>
            m.lat_long.latitude === updatedMarker.lat_long.latitude &&
              m.lat_long.longitude === updatedMarker.lat_long.longitude
              ? updatedMarker
              : m
          )
        );
        setModalVisible(false); // Fechar modal após salvar
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.message || "Erro ao salvar o ponto.");
      }
    } catch (error) {
      console.error("Erro ao salvar o ponto:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar o ponto.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.HomeTitleContainer}>
        <Text style={styles.HomeTitle}>Kersys</Text>
        <FontAwesomeIcon name="bell" size={20} color="#FFFFFF" style={styles.notificationIcon} />
      </View>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por coordenadas (latitude, longitude)"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchInputButton} onPress={() => { }}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : userLocation ? (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: userLocation ? userLocation.lat : defaultLocation.lat,
              longitude: userLocation ? userLocation.lng : defaultLocation.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onLongPress={handleMapLongPress}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.lat_long.latitude,
                  longitude: marker.lat_long.longitude,
                }}
                onPress={() => handleMarkerPress(marker)} // Abre o modal ao clicar
              >
                <Callout>
                  <View style={styles.calloutView}>
                    <Text style={styles.calloutTitle}>Informações do Ponto</Text>
                    <Text>Latitude: {marker.lat_long.latitude}</Text>
                    <Text>Longitude: {marker.lat_long.longitude}</Text>
                    <Text>
                      Notificações:{" "}
                      {marker.notificacoes.length > 0
                        ? marker.notificacoes.map((n) => n.mensagem).join(", ")
                        : "Nenhuma notificação"}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </>
      ) : (
        <Text>Carregando localização...</Text>
      )}

      {/* Componente de CRUD do Ponto */}
      {selectedMarker && (
        <PontoCRUD
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveMarker}
          onDelete={handleDeleteMarker}
          marker={selectedMarker}
        />
      )}

      {/* Navegação */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navItem, focusedItem === "logout" && styles.focusedItem]}
          onPress={() => {
            handleFocus("logout");
            Alert.alert("Logout", "Você tem certeza que deseja sair?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Sair",
                onPress: () => {
                  AsyncStorage.removeItem("userToken");
                  router.push("/");
                },
              },
            ]);
          }}
        >
          <Icon name="logout" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Logout</Text>
        </TouchableOpacity>

        {/* Outros botões do NavBar */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
  },
  notificationIcon: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#066E3A",
  },
  HomeTitle: {
    fontSize: 18,
    color: "#066E3A",
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  HomeTitleContainer: {
    backgroundColor: "white",
    borderBottomColor: "#066E3A",
    borderBottomWidth: 2, // Adicione a largura da borda aqui
    height: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  inputFocused: {
    borderColor: "#066E3A",
    borderWidth: 1.4,
  },
  searchInputButton: {
    backgroundColor: "#066E3A",
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff", // Cor do texto dentro do botão
    fontWeight: "bold",
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
    width: "auto",
    height: 80,
  },
  navbarText: {
    color: "#066E3A",
    fontSize: 12.5,
    fontWeight: "bold",
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
  map: {
    width: "100%",
    height: "75.6%",
  },
  buttonModal: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
  saveButtonModal: {
    backgroundColor: "#066E3A",
    borderRadius: 5,
    width: 150,
    marginRight: 10,
    paddingVertical: 10,
  },
  cancelButtonModal: {
    backgroundColor: "#BF0000",
    borderRadius: 5,
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
  calloutView: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: "100%",
  },
});
