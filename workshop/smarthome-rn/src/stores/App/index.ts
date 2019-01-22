import { action, observable } from 'mobx';
import {
  Alert,
  PermissionsAndroid
} from 'react-native';

class AppStore implements stores.IApp {
  // @observable activeDevice: models.IDevice;

  public showDialog(content: string, title?: string, onPress?: Function): void {
    Alert.alert(
      title || 'SenseBox',
      content,
      [
        {text: 'OK', onPress: () => {
          onPress && onPress();
        }},
      ],
      { cancelable: true }
    )
  }

  public showDialogAdvanced(content: string, title?: string, positive?: string, negative?: string, onPositive?: Function, onNegative?: Function): void {
    Alert.alert(
      title || 'SenseBox',
      content,
      [
        {text: negative, onPress: () => {
          onNegative && onNegative();
        }},
        {text: positive, onPress: () => {
          onPositive && onPositive();
        }},
      ],
      { cancelable: true }
    )
  }

  // actions

  // @action('SET_ACTIVE_DEVICE') public setActiveDevice = (device: models.IDevice) => {
  //   this.activeDevice = device;
  // }
}

export default AppStore;