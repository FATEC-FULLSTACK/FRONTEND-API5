import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4a4a4a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
  },
  disabledInput: {
    backgroundColor: "white",
    fontSize: 12,
    color: "#666",
    padding: 8,
    flex: 1,
  },
  notificationContainer: {
    padding: 10,
    width: "100%",
    marginTop: 10,
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 14,
  },
  addNotificationContainer: {
    marginTop: 10,
  },
  addNotificationInputs: {
    flexDirection: "column",
    gap: 5,
    marginBottom: 15
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#066E3A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#BF0000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  deleteButtonText: {
    marginLeft: 10,
    color: "red",
    fontSize: 16,
  },
});

export default styles;
