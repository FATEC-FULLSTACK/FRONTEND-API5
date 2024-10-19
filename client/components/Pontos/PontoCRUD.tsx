import React, { useState } from "react";
import { View, Text, TextInput, Modal, Button, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // Biblioteca de ícones
import styles from "./PontoCRUDStyles";

const PontoCRUD = ({ visible, onClose, onSave, marker, onDelete }: any) => {
  const [apelido, setApelido] = useState(marker.apelido || "");
  const [notificacoes, setNotificacoes] = useState(marker.notificacoes || []);
  const [newNotificacao, setNewNotificacao] = useState("");

  const handleAddNotificacao = () => {
    if (newNotificacao.trim()) {
      setNotificacoes([...notificacoes, { mensagem: newNotificacao }]);
      setNewNotificacao(""); // Resetar campo
    }
  };

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
  };

  const handleDelete = () => {
    onDelete(marker); // Chama a função para deletar o ponto
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
          <MaterialIcons name="gps-fixed" size={12} color="#666" />
          <TextInput
            style={styles.disabledInput}
            value={`Latitude: ${marker.lat_long.latitude}`}
            editable={false}
          />
        </View>

        <View style={styles.iconInputContainer}>
          <MaterialIcons name="gps-fixed" size={12} color="#666" />
          <TextInput
            style={styles.disabledInput}
            value={`Longitude: ${marker.lat_long.longitude}`}
            editable={false}
          />
        </View>

        {/* Notificações */}
        <View style={styles.notificationContainer}>
          <Text style={styles.sectionTitle}>Notificações:</Text>
          {notificacoes.map((notificacao: any, index: number) => (
            <View key={index} style={styles.notificationRow}>
              <Text style={styles.notificationText}>{notificacao.mensagem}</Text>
              <TouchableOpacity onPress={() => handleRemoveNotificacao(index)}>
                <FontAwesome name="minus-circle" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Adicionar nova notificação */}
          <View style={styles.addNotificationContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nova Notificação"
              value={newNotificacao}
              onChangeText={setNewNotificacao}
            />
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
