import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  Modal,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import { useRouter } from "expo-router";

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
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : userLocation ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: defaultLocation.lat,
              longitude: defaultLocation.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onLongPress={handleMapLongPress} // Captura o clique e segurar no mapa
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
    flex: 1,
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
  map: {
    width: "100%",
    height: "91%",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 0.2,
    borderColor: "rgb(160, 160, 160)",
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
