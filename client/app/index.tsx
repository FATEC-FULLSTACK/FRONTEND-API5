import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import globalStyles from "@/styles";

export default function App() {
  return (
    <View style={styles.container}>
        <Link href="/screens/Home" style={{ color: "#066E3A", marginTop: 40 }}>
            <h2>HOME</h2>
        </Link>
      <Text style={globalStyles.h1}>Login</Text>
      <Text style={globalStyles.h2}>
        By signing in you are agreeing our term and privacy policy
      </Text>
      <View>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
        />
        <h1>Não tem conta?</h1>
      <Link href="./screens/Register" style={{color: "#066E3A"}}><h3>Registre-se</h3></Link>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /* Handle login */
        }}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
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
    fontSize: 16,
    fontWeight: "bold",
  },
});
