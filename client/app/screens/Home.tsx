import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import globalStyles from "@/styles";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [markers, setMarkers] = useState<
    {
      lat: number;
      lng: number;
      clima: string;
      regiao: string;
      dadosPluviometricos: string;
    }[]
  >([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
    null
  );
  const [isModalVisible, setModalVisible] = useState(false); // Controle de visibilidade do modal
  const [newClima, setNewClima] = useState("");
  const [newRegiao, setNewRegiao] = useState("");
  const [newDadosPluviometricos, setNewDadosPluviometricos] = useState("");
  const router = useRouter();
  const [focusedItem, setFocusedItem] = useState(null);
  const [search, setSearch] = useState("");

  const navigation = useNavigation();

  const handleFocus = (item: any) => {
    setFocusedItem(item);
  };

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

  // Função para atualizar a região do mapa com base nas coordenadas
  const handleSearch = () => {
    const coords = search.split(",");
    if (coords.length === 2) {
      const latitude = parseFloat(coords[0].trim());
      const longitude = parseFloat(coords[1].trim());

      if (!isNaN(latitude) && !isNaN(longitude)) {
        setUserLocation({ lat: latitude, lng: longitude });
      } else {
        alert("Por favor, insira coordenadas válidas (latitude, longitude).");
      }
    } else {
      alert("Formato de coordenadas inválido. Use: 'latitude, longitude'.");
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

  // Função chamada ao clicar e segurar no mapa
  const handleMapLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        lat: latitude,
        lng: longitude,
        clima: "", // Inicialmente vazio para o usuário preencher
        regiao: "",
        dadosPluviometricos: "",
      },
    ]);
  };

  // Função para abrir o modal de edição ao clicar em um marcador
  const handleMarkerPress = (index: number) => {
    setSelectedMarkerIndex(index);
    setModalVisible(true);
    // Preencher os campos do modal com os dados atuais do marcador
    const marker = markers[index];
    setNewClima(marker.clima);
    setNewRegiao(marker.regiao);
    setNewDadosPluviometricos(marker.dadosPluviometricos);
  };

  // Função para salvar os dados do modal e atualizar o marcador
  const handleSave = () => {
    if (selectedMarkerIndex !== null) {
      const updatedMarkers = [...markers];
      updatedMarkers[selectedMarkerIndex] = {
        ...updatedMarkers[selectedMarkerIndex],
        clima: newClima,
        regiao: newRegiao,
        dadosPluviometricos: newDadosPluviometricos,
      };
      setMarkers(updatedMarkers);
      setModalVisible(false); // Fechar o modal após salvar
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.HomeTitleContainer}>
        <Text style={styles.HomeTitle}>Kersys</Text>
        <FontAwesomeIcon
          name="bell"
          size={20}
          color="#FFFFFF"
          style={styles.notificationIcon}
        />
      </View>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por coordenadas (latitude, longitude)"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.searchInputButton}
          onPress={handleSearch}
        >
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
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.lat,
                  longitude: userLocation.lng,
                }}
                title="Você está aqui"
              />
            )}

            {/* Mapeia e exibe todos os marcadores adicionados */}
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.lat,
                  longitude: marker.lng,
                }}
                onPress={() => handleMarkerPress(index)} // Abre o modal ao clicar
              >
                <Callout>
                  <View style={styles.calloutView}>
                    <Text style={styles.calloutTitle}>
                      Informações do Ponto
                    </Text>
                    <Text>Clima: {marker.clima || "Não informado"}</Text>
                    <Text>Região: {marker.regiao || "Não informado"}</Text>
                    <Text>
                      Dados Pluviométricos:{" "}
                      {marker.dadosPluviometricos || "Não informado"}
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
          }}
        >
          <Icon name="place" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Pontos</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para edição de informações */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Informações do Ponto</Text>
          <TextInput
            style={styles.input}
            placeholder="Clima"
            value={newClima}
            onChangeText={setNewClima}
          />
          <TextInput
            style={styles.input}
            placeholder="Região"
            value={newRegiao}
            onChangeText={setNewRegiao}
          />
          <TextInput
            style={styles.input}
            placeholder="Dados Pluviométricos"
            value={newDadosPluviometricos}
            onChangeText={setNewDadosPluviometricos}
          />
          <View style={styles.buttonModal}>
            <Button
              title="Salvar"
              onPress={handleSave}
              color="#066E3A" // Define a cor do botão "Salvar"
            />
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="#BF0000" // Fecha o modal
            />
          </View>
        </View>
      </Modal>
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
