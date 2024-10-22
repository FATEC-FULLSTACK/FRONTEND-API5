import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from './PontosStyles';
import Axios from "axios";

interface Ponto {
  _id: string;
  apelido: string;
  lat_long: {
    latitude: number;
    longitude: number;
  };
  clima: {
    temp: {
      max: number;
      min: number;
    };
    hum: {
      max: number;
      min: number;
    };
    prec: {
      max: number;
      min: number;
      media: number;
    };
  }
}

interface PontosProps {
  pontos: Ponto[];
  onSelectPonto: (ponto: Ponto) => void;
  closeModal: () => void;
}

const Pontos: React.FC<PontosProps> = ({ pontos, onSelectPonto, closeModal }) => {
  const [tempData, setTempData] = useState<{ [key: string]: { maxima: number, minima: number } } | null>(null);
  const [humData, setHumData] = useState<{ [key: string]: { maxima: number, minima: number } } | null>(null);
  const [precData, setPrecData] = useState<{ [key: string]: {media: number } } | null>(null);

  // Fetch temperature for all points when component mounts or pontos updates
  useEffect(() => {
    const fetchTemperatures = async () => {
      try {
        const tempResults = await Promise.all(pontos.map(async (ponto) => {
          const response = await Axios.post("http://10.0.2.2:3000/nsa/temp/wk", {
            lat: ponto.lat_long.latitude,
            long: ponto.lat_long.longitude
          });
          return { [ponto._id]: response.data };
        }));
        
        // Combine results into an object with ponto IDs as keys
        const tempDataCombined = Object.assign({}, ...tempResults);
        setTempData(tempDataCombined);
      } catch (error) {
        console.error("Failed to fetch temperature data:", error);
      }
    };

    if (pontos.length > 0) {
      fetchTemperatures();
    }
  }, [pontos]);

  useEffect(() => {
    const fetchHumidade = async () => {
      try {
        const humResults = await Promise.all(pontos.map(async (ponto) => {
          const response = await Axios.post("http://10.0.2.2:3000/nsa/humi/wk", {
            lat: ponto.lat_long.latitude,
            long: ponto.lat_long.longitude
          });
          return { [ponto._id]: response.data };
        }));
        
        // Combine results into an object with ponto IDs as keys
        const humDataCombined = Object.assign({}, ...humResults);
        setHumData(humDataCombined);
      } catch (error) {
        console.error("Failed to fetch humidade data:", error);
      }
    };

    if (pontos.length > 0) {
      fetchHumidade();
    }
  }, [pontos]);

  useEffect(() => {
    const fetchPrecipitacao = async () => {
      try {
        const precResults = await Promise.all(pontos.map(async (ponto) => {
          const response = await Axios.post("http://10.0.2.2:3000/nsa/prec/avg", {
            lat: ponto.lat_long.latitude,
            long: ponto.lat_long.longitude
          });
          return { [ponto._id]: response.data.media };
        }));
        
        // Combine results into an object with ponto IDs as keys
        const precDataCombined = Object.assign({}, ...precResults);
        setPrecData(precDataCombined);
      } catch (error) {
        console.error("Failed to fetch prec data:", error);
      }
    };

    if (pontos.length > 0) {
      fetchPrecipitacao();
    }
  }, [pontos]);

  const renderItem = ({ item }: { item: Ponto }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        onSelectPonto(item);
        closeModal();
      }}
    >
      <Icon name="place" size={50} color="#FF6347" />
      <View style={styles.infoContainer}>
        <Text style={styles.itemTitle}>{item.apelido}</Text>
        <Text style={styles.itemDescription}>
          Latitude: {item.lat_long.latitude}, Longitude: {item.lat_long.longitude}
        </Text>
        <Text style={styles.itemDivider}>Previsão Semanal</Text>
        <Text style={styles.itemDescription}>
          Temperatura: {tempData && tempData[item._id] ? 
            `${tempData[item._id].minima}ºC a ${tempData[item._id].maxima}ºC` : 
            "Carregando..."}
        </Text>
        <Text style={styles.itemDescription}>
          Humidade: {humData && humData[item._id] ? 
            `${humData[item._id].minima} a ${humData[item._id].maxima}` : 
            "Carregando..."}
        </Text>
        <Text style={styles.itemDescription}>
          Precipitação média: {precData ? 
            `${precData[item._id]}mm` : 
            "Carregando..."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.modalContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Seus Pontos</Text>
        <FlatList
          data={pontos}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default Pontos;
