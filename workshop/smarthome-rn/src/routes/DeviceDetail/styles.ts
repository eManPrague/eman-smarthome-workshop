import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10
  },

  subtitle: {
    fontSize: 20,
    color: '#353b4a',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb'
  },

  cardContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: 'white',
  },

  card: {
    height: 260,
    width: '46%',
    margin: '2%',
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 15
  },

  cardTitle: {
    color: '#FFFFFF90',
    fontSize: 10,
    fontWeight: '600',
    marginVertical: 20
  },

  cardValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '400',
  },

  cardSign: {
    color: '#FFFFFF90',
    fontSize: 18,
    fontWeight: '600'
  },

  switch: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },

  slider: {
    position: 'absolute',
    bottom: 17,
    left: 15,
    width: '100%',
    height: 40,
  },

  icon: {
    color: 'white'
  },

  blueDark: {
    backgroundColor: '#121729'
  },
  blueLight: {
    backgroundColor: '#3b7bb1'
  },
  red: {
    backgroundColor: '#bb3237'
  },
  green: {
    backgroundColor: '#4ea678'
  },
});