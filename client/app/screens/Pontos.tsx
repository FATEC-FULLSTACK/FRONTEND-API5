import { Link, router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ponto {
  id: number;
  nome: string;
  descricao: string;
}

const Pontos: React.FC = () => {
  const [pontos, setPontos] = useState<Ponto[]>([]);
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
              // Zera o token (remove o JWT do AsyncStorage)
              await AsyncStorage.removeItem('userToken');
  
              router.push("/");
            } catch (error) {
              console.error("Erro ao fazer logout:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  // Simulação de dados cadastrados (substitua isso pela sua lógica real de recuperação de dados)
  useEffect(() => {
    const fetchPontos = async () => {
      // Aqui você pode fazer uma chamada para sua API ou usar dados mockados
      const dadosMockados: Ponto[] = [
        { id: 1, nome: "Ponto 1", descricao: "Descrição do Ponto 1" },
        { id: 2, nome: "Ponto 2", descricao: "Descrição do Ponto 2" },
        { id: 3, nome: "Ponto 3", descricao: "Descrição do Ponto 3" },
      ];
      setPontos(dadosMockados);
    };

    fetchPontos();
  }, []);

  const renderItem = ({ item }: { item: Ponto }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.nome}</Text>
      <Text style={styles.itemDescription}>{item.descricao}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Seus Pontos</Text>
        <FlatList
          data={pontos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>
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
            focusedItem === "localidade" && styles.focusedItem,
          ]}
          onPress={() => {
            handleFocus("localidade"); 
            navigation.navigate("screens/Coordenadas"); 
          }}
        >
          <Icon name="public" size={25} color="#066E3A" />
          <Text style={styles.navbarText}>Localidade</Text>
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
          onPress={() => handleFocus("actions")}
        >
          <Icon name="place" size={25} color="#066E3A" />
          <Link href="./Pontos">
            <Text style={styles.navbarText}>Pontos</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  contentContainer: {
    height: "90%",
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  focusedItem: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#66BB6A",
    borderRadius: 5,
    paddingBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default Pontos;
