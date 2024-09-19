import CustomInput from "@/components/Input";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StyleSheet } from "react-native";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.register}>
        <Image
          source={require("../../assets/images/login/registerUser.png")}
        />
        <Text style={styles.title}>Register User</Text>
      </View>
      <Text style={{ fontSize: 20 }}>
        By registering in you are agreeing our{" "}
        <Text style={{ color: "#066E3A" }}>term and privacy policy</Text>
      </Text>
      <View>
        <CustomInput label="Name" placeholder="Digite seu nome..." />
      </View>
      <View>
        <CustomInput label="Email" placeholder="Digite seu email..." />
      </View>
      <View style={styles.inputContainer}>
        <CustomInput
          label="Password"
          placeholder="Digite sua senha..."
          secureTextEntry={true}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        ></View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /* Handle register */
        }}
      >
        <Text style={styles.buttonText}>Register</Text>
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
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 15,
    fontSize: 32,
    fontWeight: "bold",
    left: "-1%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
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
