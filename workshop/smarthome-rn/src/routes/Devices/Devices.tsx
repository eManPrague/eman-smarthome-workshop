import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';
import styles from './styles';

export default class Devices extends React.Component<components.IDevicesProps> {
  static navigationOptions = {
    title: 'Nearby devices',
    headerTitleStyle: {
      fontSize: 20,
      color: '#353b4a',
      fontWeight: '400'
    }
  };

  constructor(props: components.IDevicesProps) {
    super(props);
  }

  render() {
    const { devices, selectDevice, connectingTo } = this.props;

    return (
      <FlatList
        style={styles.container}
        data={devices}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => selectDevice(index)} >
              <View style={styles.row}>
                <Text style={styles.rowText}>
                  {item.name}
                </Text>
                {
                  (!!connectingTo && connectingTo.id === item.id) && <Text style={styles.connectingText}>Connecting...</Text>
                }
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  }
}