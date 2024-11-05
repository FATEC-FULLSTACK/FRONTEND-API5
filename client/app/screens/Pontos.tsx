import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from './PontosStyles';
import Axios from "axios";
import { fetchTemperatureData, fetchHumidityData, fetchPrecipitationChanceData, fetchPrecipitationData } from "../../components/ApiClima/openMeteoApi"

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
        const tempResults = await Promise.all(
          pontos.map(async (ponto) => {
            const weatherData = await fetchTemperatureData(ponto.lat_long.latitude, ponto.lat_long.longitude);
            const hourlyTemps = weatherData.hourly.temperature_2m;
            
            // You may need to adjust this to extract min and max temperatures correctly
            const maxTemp = Math.max(...hourlyTemps);
            const minTemp = Math.min(...hourlyTemps);
  
            return { [ponto._id]: { maxima: maxTemp, minima: minTemp } };
          })
        );
  
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
    const fetchHumidity = async () => {
      try {
        const humResults = await Promise.all(
          pontos.map(async (ponto) => {
            const weatherData = await fetchHumidityData(ponto.lat_long.latitude, ponto.lat_long.longitude);
            const hourlyHumidity = weatherData.hourly.relative_humidity_2m;
            
            const maxHum = Math.max(...hourlyHumidity);
            const minHum = Math.min(...hourlyHumidity);
  
            return { [ponto._id]: { maxima: maxHum, minima: minHum } };
          })
        );
  
        const humDataCombined = Object.assign({}, ...humResults);
        setHumData(humDataCombined);
      } catch (error) {
        console.error("Failed to fetch humidity data:", error);
      }
    };
  
    if (pontos.length > 0) {
      fetchHumidity();
    }
  }, [pontos]);
  
  useEffect(() => {
    const fetchPrecipitation = async () => {
      try {
        const precResults = await Promise.all(
          pontos.map(async (ponto) => {
            const weatherData = await fetchPrecipitationData(ponto.lat_long.latitude, ponto.lat_long.longitude);
            const hourlyPrecipitation = weatherData.hourly.precipitation;
  
            // Calculate average precipitation
            const averagePrecipitation = hourlyPrecipitation.reduce((a, b) => a + b, 0) / hourlyPrecipitation.length;
  
            return { [ponto._id]: averagePrecipitation };
          })
        );
  
        const precDataCombined = Object.assign({}, ...precResults);
        setPrecData(precDataCombined);
      } catch (error) {
        console.error("Failed to fetch precipitation data:", error);
      }
    };
  
    if (pontos.length > 0) {
      fetchPrecipitation();
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
