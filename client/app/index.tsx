import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import globalStyles from "@/styles";
import CustomInput from "@/components/Input";
import * as Location from 'expo-location'; 
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Armazenar o token JWT recebido no AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
  
        Alert.alert("Login bem-sucedido", "Bem-vindo à sua conta!", [
          { text: "OK", onPress: () => router.push("/screens/Home") },
        ]);
      } else {
        Alert.alert("Erro de login", data.message || "Credenciais inválidas", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao fazer login. Tente novamente.", [
        { text: "OK" },
      ]);
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greenDetail} />
        {/*  <Link href="/screens/Home" style={{ color: "#066E3A", marginTop: 40 }}>
            <Text>HOME</Text>
        </Link>    */}
        <Text style={globalStyles.h1}>Login</Text>
      </View>
      <View>
        <Text style={{ fontSize: 18 }}>
          Ao fazer login, você concorda com nossos{" "}
          <Text style={{ color: "#066E3A" }}>
            termos e política de privacidade
          </Text>
        </Text>
      </View>
      <View>
        <CustomInput
          label="Email"
          placeholder="Digite seu email..."
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <CustomInput
          label="Password"
          placeholder="Digite sua senha..."
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.TextConta}>Não tem conta?</Text>
          <Link href="./screens/Register" style={{ color: "#066E3A" }}>
            <Text>Registre-se</Text>
          </Link>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "white",
    height: "100%",
  },
  inputContainer: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
    marginBottom: 10,
  },
  greenDetail: {
    backgroundColor: "#066E3A",
    borderRadius: 5,
    height: 22,
    width: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  inputFocused: {
    borderColor: "#066E3A",
    borderWidth: 1.4,
  },
  button: {
    backgroundColor: "#066E3A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  TextConta: {
    marginTop: 10,
    marginBottom: 10,
  },
});
