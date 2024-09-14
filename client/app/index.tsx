import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import globalStyles from "@/styles";
import CustomInput from "@/components/Input";

export default function App() {
  return (
    <View style={styles.container}>
      <Link
        href="/screens/Home"
        style={{ color: "#066E3A", marginTop: 40, marginBottom: 10 }}
      >
        <Text>HOME</Text>
      </Link>
      <Text style={globalStyles.h1}>Login</Text>
      <Text style={{ fontSize: 20 }}>
        By signing in you are agreeing our{" "}
        <Text style={{ color: "#066E3A" }}>term and privacy policy</Text>
      </Text>
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
        >
          <Text style={styles.TextConta}>Não tem conta?</Text>
          <Link href="./screens/Register" style={{ color: "#066E3A" }}>
            <Text>Registre-se</Text>
          </Link>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /* Handle login */
        }}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Image
        source={require("../assets/images/login/enviroment.png")}
        style={styles.image}
      />
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
  image: {
    marginLeft: "-20%",
    top: "18%",
    width: 340,
    height: 200,
    marginTop: 20,
  },
});
