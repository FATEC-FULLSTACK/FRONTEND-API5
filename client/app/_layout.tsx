import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Register" options={{ headerShown: false }} />
      <Stack.Screen
        name="screens/Pontos"
        options={{
          headerShown: true,
          title: "Pontos Cadastrados",
        }}
      />
      <Stack.Screen
        name="screens/Coordenadas"
        options={{
          headerShown: true,
          title: "Achar Coordenada",
        }}
      />
      <Stack.Screen name="screens/Home" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({});
