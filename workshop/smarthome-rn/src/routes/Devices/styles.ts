import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  row: {
    height: 80,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 20
  },
  connectingText: {
    fontSize: 14,
    color: '#4ea678'
  }
});
