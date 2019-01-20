import { autorun, observable, decorate, action } from 'mobx';
import BaseMobXPresenter from '../base/BasePresenter';

class DevicesMobXPresenter extends BaseMobXPresenter implements components.IDevicesProps {
  devices: models.IDevice[] = [];
  connectingTo: models.IDevice = null;

  protected init() {
    const { bluetooth } = this.services;
    const { app } = this.stores;

    this.addDisposer(autorun(() => {
      this.devices = Array.from(bluetooth.devices)
        .map(keyDevicePair => { // create array of devices
          const device = keyDevicePair[1];
          (device as any).key = keyDevicePair[0];
          return device;
        })
        .filter(device => {
          return (Date.now()/1000 - device.discoveredTimestamp < 5)  // filter devices discovered before X seconds
        })
        .sort((a, b) => a.name.localeCompare(b.name)) // sort alphabetically
    }));

    bluetooth.requestPermission().then(granted => {
      if (granted) {
        bluetooth.start();
      } else {
        app.showDialog('This app needs Bluetooth permission.', 'Error');
      }
    })

    }


  public selectDevice = (index: number) => {
    const { bluetooth } = this.services;

    this.setConnectingTo(this.devices[index]);

    bluetooth.connectToDevice(this.devices[index].id).then(() => {
      this.services.navigation.navigate('DeviceDetail');
    }).finally(() => {
      this.setConnectingTo(null);
    })
  }

  @action('SET_CONNECTING_DEVICE') public setConnectingTo = async (device: models.IDevice) => {
    this.connectingTo = device;
  } 

}

decorate(DevicesMobXPresenter, {
  devices: observable,
  connectingTo: observable
})

export default DevicesMobXPresenter;
