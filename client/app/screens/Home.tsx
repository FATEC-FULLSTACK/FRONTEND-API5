import { Text } from "react-native"
import { Link } from "expo-router";

export default function HomeScreen(){
    return (
        <>
            <Text>
                Página Home
            </Text>
            <Link href="/" style={{ color: "#066E3A", marginTop: 40 }}>
                <h1>Voltar</h1>
            </Link>
        </>
    )
}