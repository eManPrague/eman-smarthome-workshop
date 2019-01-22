import BluetoothService from './Bluetooth';
import NavigationService from './Navigation';

const services: services.IServices = {
  bluetooth: new BluetoothService(),
  navigation: NavigationService,
};

export default services;