import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

let weatherDataArray = [];

// Mock de dados do clima
export const fetchWeatherData = async (
  temperatura: number,
  umidade: number,
  precipitacao: number
) => {
  const newWeatherData = {
    temperatura,
    umidade,
    precipitacao,
    timestamp: new Date().toISOString(),
  };
  weatherDataArray.push(newWeatherData);
  // Dados mockados
  const data = [
    {
      temperature: 32,
      humidity: 85,
      precipitation: 12,
      date: new Date().toISOString(),
    },
    {
      temperature: 28,
      humidity: 78,
      precipitation: 5,
      date: new Date().toISOString(),
    },
    {
      temperature: 35,
      humidity: 90,
      precipitation: 15,
      date: new Date().toISOString(),
    },
  ];

  // Filtra os dados com base nos limites passados
  const filteredData = data.filter(
    (item) =>
      item.temperature > temperatura ||
      item.humidity > umidade ||
      item.precipitation > precipitacao
  );

  return filteredData;
};

const WeatherNotification = (
  temperatura: number,
  umidade: number,
  precipitacao: number
) => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Contagem de notificações não lidas

  const temperatureLimit = 30; // Limite de temperatura
  const humidityLimit = 80; // Limite de umidade
  const precipitationLimit = 10; // Limite de precipitação

  // Toggle para abrir/fechar o modal
  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);

    // Se o modal estiver sendo fechado, zerar a contagem de notificações
    if (isModalVisible) {
      setUnreadCount(0);
    }
  };

  // Fetch dos dados do clima
  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeatherData(
        temperatureLimit,
        humidityLimit,
        precipitationLimit
      );
      setWeatherData(data);
    };

    getWeather();
  }, [temperatureLimit, humidityLimit, precipitationLimit]);

  // Verifica se algum dado ultrapassa o limite e conta as notificações não lidas
  const shouldShowNotification = weatherData && weatherData.length > 0;

  useEffect(() => {
    if (shouldShowNotification) {
      setUnreadCount(1); // Defina a contagem de notificações não lidas
    } else {
      setUnreadCount(0); // Se não houver nada para notificar, a contagem é 0
    }
  }, [weatherData]);

  // Função para adicionar a notificação
  const handleAddNotificacao = async () => {
    try {
      // Passa os valores de temperatura, umidade e precipitação para a função
      const data = await fetchWeatherData(temperatura, umidade, precipitacao);
      setWeatherData(data); // Atualiza o estado com os dados filtrados

      if (data.length > 0) {
        setUnreadCount(1); // Adiciona notificação
      } else {
        setUnreadCount(0); // Se não houver dados que excedem o limite, sem notificação
      }
    } catch (error) {
      console.error("Erro ao buscar os dados", error);
      Alert.alert("Erro", "Não foi possível enviar os dados de clima.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.HomeTitleContainer}>
        <Text style={styles.HomeTitle}>Kersys</Text>

        {/* Ícone de Campainha */}
        <TouchableOpacity onPress={toggleModal} style={styles.iconContainer}>
          <Icon
            name="bell"
            size={20}
            color="#FFFFFF"
            style={styles.notificationIcon}
          />
        </TouchableOpacity>

        {/* Badge de Notificação */}
        {unreadCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Modal de Notificação */}
      {shouldShowNotification && isModalVisible && weatherData.length > 0 && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Weather Notifications</Text>

                <ScrollView style={styles.notificationList}>
                  {weatherData.map((data, index) => (
                    <View key={index} style={styles.notificationItem}>
                      {data.temperature > temperatureLimit && (
                        <Text style={styles.modalText}>
                          Temperature: {data.temperature}°C (Exceeds limit!)
                        </Text>
                      )}
                      {data.humidity > humidityLimit && (
                        <Text style={styles.modalText}>
                          Humidity: {data.humidity}% (Exceeds limit!)
                        </Text>
                      )}
                      {data.precipitation > precipitationLimit && (
                        <Text style={styles.modalText}>
                          Precipitation: {data.precipitation}mm (Exceeds limit!)
                        </Text>
                      )}
                      <Text style={styles.dateText}>
                        Date: {new Date(data.date).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  onPress={toggleModal}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  HomeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  HomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 10,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    alignSelf: "flex-end",
    marginLeft: 190,
  },
  notificationIcon: {
    color: "#066E3A",
  },
  notificationBadge: {
    position: "absolute",
    top: 3,
    right: 1,
    backgroundColor: "red",
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationList: {
    width: "100%",
  },
  notificationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    width: "100%",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default WeatherNotification;
