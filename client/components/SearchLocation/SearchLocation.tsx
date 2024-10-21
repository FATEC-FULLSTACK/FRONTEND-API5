import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  Alert,
} from "react-native";
import { GOOGLE_API_KEY } from "@/config";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import * as Location from "expo-location";

interface Coordinates {
  lat: number;
  lng: number;
}

interface SearchLocationProps {
  onLocationSelect: (lat: number, lng: number) => void; // Função para retornar as coordenadas para o HomeScreen
}

const SearchLocation: React.FC<SearchLocationProps> = ({ onLocationSelect }) => {
  const [location, setLocation] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]); // Para guardar as sugestões de auto-completar
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar sugestões de localizações
  const fetchSuggestions = async (input: string) => {
    if (input.length > 2) { // Começar a buscar após 3 caracteres
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();
        if (data.status === "OK") {
          setSuggestions(data.predictions); // Armazena as sugestões
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        setError("Erro ao buscar sugestões.");
      }
    } else {
      setSuggestions([]); // Limpa as sugestões se o input for muito curto
    }
  };

  // Função para buscar coordenadas com base na localização selecionada
  const fetchCoordinates = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ lat, lng });
        setError(null);
        onLocationSelect(lat, lng); // Passar as coordenadas de volta ao HomeScreen
      } else {
        setError("Localização não encontrada.");
      }
    } catch (err) {
      setError("Erro ao buscar coordenadas.");
    }
  };

  // Função para obter a localização atual do aparelho
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não foi possível obter a localização.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      onLocationSelect(latitude, longitude); // Passar a localização atual para o HomeScreen
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a localização.");
    }
  };

  return (
    <View>
      <View style={styles.searchInputContainer}>
        {/* Ícone de GPS estilo radar à esquerda */}
        <TouchableOpacity onPress={getCurrentLocation} style={styles.gpsButton}>
          <FontAwesomeIcon name="crosshairs" size={20} color="#066E3A" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Digite uma região (ex: São Paulo)"
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            fetchSuggestions(text); // Buscar sugestões enquanto o usuário digita
          }}
        />

        {/* Ícone de busca */}
        <TouchableOpacity onPress={() => fetchCoordinates(location)}>
          <FontAwesomeIcon name="search" size={20} color="#066E3A" />
        </TouchableOpacity>
      </View>

      {/* Exibir sugestões de auto-completar */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setLocation(item.description); // Atualiza o campo de busca
                fetchCoordinates(item.place_id); // Busca as coordenadas com base na sugestão
                setSuggestions([]); // Limpa as sugestões após a seleção
              }}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000", // Sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 10,
    height: 40,
  },
  gpsButton: {
    marginRight: 10,
    padding: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default SearchLocation;
