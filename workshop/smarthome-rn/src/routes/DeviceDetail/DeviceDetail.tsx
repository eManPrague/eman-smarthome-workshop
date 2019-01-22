import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Slider
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignore
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
// @ts-ignore
import IconOcticons from 'react-native-vector-icons/Octicons';
import styles from './styles';


export default class DeviceDetail extends React.Component<components.IDeviceDetailProps, components.IDeviceDetailState> {
  static navigationOptions = {
    title: 'Home overview',
    headerTitleStyle: {
      fontSize: 20,
      color: '#353b4a',
      fontWeight: '400'
    },
  };

  constructor(props: components.IDeviceDetailProps) {
    super(props);

    this.state = {
      lightSwitch: null
    }
  }

  changeLightSwitch = (value: boolean) => {
    this.setState({lightSwitch: value});
    const { changeLight } = this.props;
    changeLight(value);
  }

  changeLightIntensity = (value: number) => {
    const { changeLightIntensity } = this.props;
    changeLightIntensity(value);
  }

  get temperature(): string {
    const { temperatureMessage } = this.props;
    return temperatureMessage ? temperatureMessage.valueDecimal.toFixed(1) : '-';
  }

  get pressure(): string {
    const { pressureMessage } = this.props;
    return pressureMessage ? pressureMessage.valueDecimal.toFixed(1) : '-';
  }

  get light(): string {
    const { lightMessage } = this.props;
    // set switch state only at the beginning
    if (this.state.lightSwitch === null) {
      lightMessage ? this.setState({lightSwitch: !!lightMessage.state }) : ()=>{};
    }
    return lightMessage ? ( lightMessage.state ? 'ON' : 'OFF' ) : '-';
  }

  get lightBoolean(): boolean {
    const { lightMessage } = this.props;
    return lightMessage ? lightMessage.state : false;
  }

  get lightIntensity(): string {
    const { lightIntensityMessage } = this.props;
    return lightIntensityMessage ? lightIntensityMessage.value : '-';
  }

  render() {
    const { changeLightIntensity } = this.props;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.cardContainer}>
          
          <View style={[styles.card, styles.red]}>
            <IconOcticons name='light-bulb' size={40} color="#FFF"/>
            <Text style={styles.cardTitle}>LIGHTS</Text>
            <Text style={styles.cardSign}>{this.light}</Text>
            <Switch style={styles.switch} value={this.state.lightSwitch} onValueChange={this.changeLightSwitch} thumbColor="#FFF"/>
          </View>

          <View style={[styles.card, styles.blueDark]}>
            <IconOcticons name='light-bulb' size={40} color="#FFF"/>
            <Text style={styles.cardTitle}>LIGHT INTENSITY</Text>
            <Text>
              <Text style={styles.cardValue}>{this.lightIntensity}</Text>
              <Text style={styles.cardSign}>%</Text>
            </Text>
            <Slider value={isNaN(this.lightIntensity) ? 0 : this.lightIntensity} onValueChange={changeLightIntensity} style={styles.slider} minimumValue={0} maximumValue={100} step={1} minimumTrackTintColor='#FFF' thumbTintColor='#FFF' maximumTrackTintColor='#FFF'/>
          </View> 

          <View style={[styles.card, styles.blueLight]}>
            <IconFontAwesome name='thermometer-half' size={40} color="#FFF"/>
            <Text style={styles.cardTitle}>AIR TEMPERATURE</Text>
            <Text>
              <Text style={styles.cardValue}>{this.temperature}°</Text>
              <Text style={styles.cardSign}>C</Text>
            </Text>
          </View>

          <View style={[styles.card, styles.green]}>
            <MaterialCommunityIcons name='weather-cloudy' size={40} color="#FFF"/>
            <Text style={styles.cardTitle}>AIR PRESSURE</Text>
            <Text>
              <Text style={styles.cardValue}>{this.pressure}</Text>
              <Text style={styles.cardSign}>hPa</Text>
            </Text>
          </View>

        </View>
      </ScrollView> 
    );
  }
}
