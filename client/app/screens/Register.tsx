import React, { useState } from "react";
import CustomInput from "@/components/Input";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { StyleSheet } from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_usuario: name,
          email_usuario: email,
          senha_usuario: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();
      Alert.alert(
        "Sucesso",
        `Usuário ${data.nome_usuario} registrado com sucesso!`
      );
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert("Erro", "Ocorreu um erro desconhecido.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.register}>
        <View style={styles.greenDetail} />
        <Text style={styles.title}>Cadastrar Usuário</Text>
      </View>
      <Text style={{ fontSize: 18 }}>
        Ao se registrar, você está concordando com nossos{" "}
        <Text style={{ color: "#066E3A" }}>
          termos e política de privacidade
        </Text>
      </Text>
      <View>
        <CustomInput
          label="Name"
          placeholder="Digite seu nome..."
          value={name}
          onChangeText={setName}
        />
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
        ></View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <Link
        href="/"
        style={{
          color: "#066E3A",
          marginTop: 20,
          textAlign: "left",
          letterSpacing: 0.5,
        }}
      >
        Voltar para o login.
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  register: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
    marginTop: 10,
    marginBottom: 8,
    fontSize: 32,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  greenDetail: {
    backgroundColor: "#066E3A",
    borderRadius: 5,
    height: 22,
    width: 8,
  },
  container: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "white",
    height: "100%",
  },
  inputContainer: {
    marginBottom: 8,
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
