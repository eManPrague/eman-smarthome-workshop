// supress React deprecated warnings in YellowBox (they're still shown via debugger's console)
console.disableYellowBox = true;

import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import Devices from './routes/Devices/index.mobx';
import DeviceDetail from './routes/DeviceDetail/index.mobx';
import NavigationService from './services/Navigation';
import { StatusBar, View } from 'react-native';

const TopLevelNavigator = StackNavigator(
  {
    Devices: { screen: Devices },
    DeviceDetail: { screen: DeviceDetail },
  },
  {
    initialRouteName: 'Devices',
  },
);


class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <TopLevelNavigator
          ref={(navigatorRef: any) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }} />
      </View>
    );
  }
}

export default App;