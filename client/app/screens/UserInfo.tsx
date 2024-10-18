import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do usuário logado
  const fetchUserData = async () => {
    try {
      // Recupera o token JWT do AsyncStorage
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert("Erro", "Nenhum token encontrado. Faça login novamente.");
        return;
      }

      // Faz uma requisição à rota protegida passando o token no cabeçalho
      const response = await fetch('http://10.0.2.2:3000/ck', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data); // Armazena os dados do usuário no estado
      } else {
        Alert.alert("Erro", data.message || "Erro ao buscar dados do usuário.");
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar os dados do usuário.");
    } finally {
      setLoading(false); // Para a animação de carregamento
    }
  };

  // Efeito colateral para buscar os dados do usuário ao montar o componente
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      {userData ? (
        <>
          <Text>Usuário logado:</Text>
          <Text>ID: {userData._id}</Text>
          <Text>Nome: {userData.username}</Text>
          <Text>Email: {userData.email}</Text>
        </>
      ) : (
        <Text>Nenhum dado de usuário encontrado.</Text>
      )}

      <Button
        title="Buscar dados novamente"
        onPress={fetchUserData}
      />
    </View>
  );
};

export default UserInfo;
