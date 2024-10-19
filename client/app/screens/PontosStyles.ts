import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  contentContainer: {
    height: "90%",
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center", // Alinha miniatura e texto na mesma linha
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1, // Faz com que as informações preencham o espaço restante
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  alertIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  notification: {
    fontSize: 13,
    color: "#999",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    padding: 5,
    height: 80,
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  focusedItem: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#66BB6A",
    borderRadius: 5,
    paddingBottom: 5,
  },
  navbarText: {
    color: "#066E3A",
    fontSize: 12.5,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
