import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    padding: 5,
    width: "100%",
    height: 80,
    position: "absolute",
    bottom: 0,
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
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
});

export default styles;
