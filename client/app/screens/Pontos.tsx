import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from './PontosStyles';

interface Ponto {
  _id: string;
  apelido: string;
  lat_long: {
    latitude: number;
    longitude: number;
  };
  notificacoes: {
    _id: string;
    mensagem: string;
  }[];
}

const Pontos: React.FC = () => {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [focusedItem, setFocusedItem] = useState(null);
  const navigation = useNavigation();

  const handleFocus = (item: any) => {
    setFocusedItem(item);
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
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
              navigation.navigate("/"); 
            } catch (error) {
              console.error("Erro ao fazer logout:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Nenhum token encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch('http://10.0.2.2:3000/ck', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar os dados do usuário.");
    }
  };

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
        const data = await response.json();
        setPontos(data);
      } else {
        Alert.alert("Erro", "Erro ao buscar pontos do usuário.");
      }
    } catch (error) {
      console.error("Erro ao buscar pontos:", error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar os pontos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Ponto }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("MapScreen", {
          latitude: item.lat_long.latitude,
          longitude: item.lat_long.longitude,
        })
      }
    >
      {/* Ícone de local em vez de imagem de miniatura */}
      <Icon name="place" size={50} color="#FF6347" />
      <View style={styles.infoContainer}>
        <Text style={styles.itemTitle}>{item.apelido}</Text>
        <Text style={styles.itemDescription}>
          Latitude: {item.lat_long.latitude}, Longitude: {item.lat_long.longitude}
        </Text>
        {item.notificacoes.map((notificacao) => (
          <View key={notificacao._id} style={styles.alertContainer}>
            {/* Ícone de alerta em vez de imagem */}
            <Icon name="warning" size={20} color="#FF0000" />
            <Text style={styles.notification}>{notificacao.mensagem}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Seus Pontos</Text>
        <FlatList
          data={pontos}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navItem, focusedItem === "logout" && styles.focusedItem]}
          onPress={() => {
            handleFocus("logout");
            handleLogout();
          }}
        >
          <Icon name="logout" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, focusedItem === "localidade" && styles.focusedItem]}
          onPress={() => {
            handleFocus("localidade");
            navigation.navigate("Coordenadas");
          }}
        >
          <Icon name="public" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Localidade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, focusedItem === "settings" && styles.focusedItem]}
          onPress={() => handleFocus("settings")}
        >
          <Icon name="settings" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Opções</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, focusedItem === "actions" && styles.focusedItem]}
          onPress={() => handleFocus("actions")}
        >
          <Icon name="place" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Pontos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Pontos;
