import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window'); // Pegando a largura da tela

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    width: width, // Garante que o modal ocupe toda a largura da tela
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 10,
    width: '100%', // Garante que o conteúdo ocupe toda a largura disponível
  },
  listContainer: {
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    alignContent: "center",
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#066E3A",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  itemDivider: {
    marginTop: 12,
    marginBottom:12,
    fontWeight:"bold",
  }
  ,

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#066E3A",
    textAlign: "center",
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#066E3A",
  },
  buttonCloseModal: {
    backgroundColor: "#BF0000",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#066E3A",
    fontSize: 16,
  },
});

export default styles;
