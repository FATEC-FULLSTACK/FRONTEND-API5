import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  searchInputButton: {
    backgroundColor: '#066E3A',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default styles;
