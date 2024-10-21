import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from './PontosStyles';

interface Ponto {
  _id: string;
  apelido: string;
  lat_long: {
    latitude: number;
    longitude: number;
  };
}

interface PontosProps {
  pontos: Ponto[]; // Pontos já carregados, passados como prop
  onSelectPonto: (ponto: Ponto) => void;
  closeModal: () => void;
}

const Pontos: React.FC<PontosProps> = ({ pontos, onSelectPonto, closeModal }) => {
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
