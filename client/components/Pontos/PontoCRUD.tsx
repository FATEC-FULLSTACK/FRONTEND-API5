import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // Biblioteca de ícones
import styles from "./PontoCRUDStyles";
import { sendWeatherData } from "@/app/services/notification";
import WeatherNotification, { fetchWeatherData } from "../NotificationBell/NotificationBell";

const PontoCRUD = ({ visible, onClose, onSave, marker, onDelete }: any) => {
  const [apelido, setApelido] = useState(marker.apelido || "");
  const [notificacoes, setNotificacoes] = useState(marker.notificacoes || []);
  const [newNotificacao, setNewNotificacao] = useState("");
  const [temperatura, setTemperatura] = useState<number>(0);
  const [precipitacao, setPrecipitacao] = useState<number>(0);
  const [umidade, setUmidade] = useState<number>(0);

  const handleAddNotificacao = async () => {
    try {
      await fetchWeatherData(temperatura, umidade, precipitacao)
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar os dados de clima.");
    }
  };

  // Atualiza o estado local toda vez que o modal é aberto ou o marker muda
  useEffect(() => {
    if (marker) {
      setApelido(marker.apelido);
      setNotificacoes(marker.notificacoes || []);
    }
  }, [marker]);

  const handleRemoveNotificacao = (index: number) => {
    const updatedNotificacoes = notificacoes.filter((_, i) => i !== index);
    setNotificacoes(updatedNotificacoes);
  };

  const handleSave = () => {
    onSave({
      ...marker,
      apelido,
      notificacoes,
    });
    onClose(); // Fecha o modal ao salvar
  };

  const handleDelete = () => {
    onDelete(marker); // Chama a função para deletar o ponto
    onClose(); // Fecha o modal após deletar
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Editar Informações do Ponto</Text>

        {/* Campo de apelido do ponto com ícone de local */}
        <View style={styles.iconInputContainer}>
          <MaterialIcons name="location-on" size={24} color="#066E3A" />
          <TextInput
            style={styles.input}
            placeholder="Apelido"
            value={apelido}
            onChangeText={setApelido}
          />
        </View>

        {/* Latitude e Longitude como campos não editáveis com ícone de GPS */}
        <View style={styles.iconInputContainer}>
          <MaterialIcons name="gps-fixed" size={24} color="#666" />
          <TextInput
            style={styles.disabledInput}
            value={`Latitude: ${marker.lat_long.latitude.toFixed(5)}`}
            editable={false}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <MaterialIcons name="gps-fixed" size={24} color="#666" />
          <TextInput
            style={styles.disabledInput}
            value={`Longitude: ${marker.lat_long.longitude.toFixed(5)}`}
            editable={false}
          />
        </View>

        <View style={styles.notificationContainer}>
          {/* <Text style={styles.sectionTitle}>Notificações:</Text>
          {notificacoes.map((notificacao: any, index: number) => (
            <View key={index} style={styles.notificationRow}>
              <Text style={styles.notificationText}>
                {notificacao.mensagem}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveNotificacao(index)}>
                <FontAwesome name="minus-circle" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}  */}

          {/* Adicionar nova notificação */}
          <View style={styles.addNotificationContainer}>
            <View style={styles.addNotificationInputs}>
              <TextInput
                style={styles.input}
                placeholder="Define um limite de temperatura"
                value={String(temperatura)} // Converte para string
                onChangeText={(text) => setTemperatura(Number(text))}
              />
              <TextInput
                style={styles.input}
                placeholder="Defina um limite de precipitação"
                value={String(precipitacao)} // Converte para string
                onChangeText={(text) => setPrecipitacao(Number(text))}
              />
              <TextInput
                style={styles.input}
                placeholder="Defina um limite de umidade"
                value={String(umidade)} // Converte para string
                onChangeText={(text) => setUmidade(Number(text))}
              />
            </View>
            <TouchableOpacity onPress={handleAddNotificacao}>
              <FontAwesome name="plus-circle" size={20} color="green" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botões Salvar e Cancelar com ícones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <FontAwesome name="check-circle" size={20} color="white" />
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <FontAwesome name="times-circle" size={20} color="white" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de deletar ponto */}
        {marker._id && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <FontAwesome name="trash" size={24} color="red" />
            <Text style={styles.deleteButtonText}>Deletar Ponto</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default PontoCRUD;
