import { observable, action, decorate } from 'mobx';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device, State, Characteristic } from 'react-native-ble-plx';
import UUID from './uuid';

class BluetoothService implements services.IBluetooth {
  devices: Map<string, models.IDevice> = new Map();
  connectedDevice: models.IDevice = null;
  characteristicsForConnectedDevice: Map<string, models.ICharacteristic> = new Map();

  // private
  private manager = new BleManager();
  private characteristicSubscriptions: Map<string, { remove: Function }> = new Map();
  private characteristicsBeingRead: Set<string> = new Set();
  

  constructor() {
    this.manager.onStateChange = this.onStateChange;
  }

  public startDeviceScan = (): Promise<boolean> => {
    console.log('Scanning for devices...');
    return new Promise((resolve, reject) => {
      this.manager.stopDeviceScan();
      this.manager.startDeviceScan([UUID.service], null, (error?: Error, device?: Device) => {
        if (error) {
          console.log(error);
          reject(error)
        }
        this.onDeviceDiscovered(device);
        resolve(true);
      });
    });
  }

  public stopDeviceScan = () => {
    this.manager.stopDeviceScan();
  }

  public connectToDevice = (id: string): Promise<models.IDevice> => {
    return new Promise((resolve, reject) => {
      this.manager.isDeviceConnected(id).then((isConnected: boolean) => {
        if (!isConnected) {
          this.manager.connectToDevice(id, {requestMTU: 512})
            .then(device => {
              console.log(`Connected to device ${device.id}.`);
              this.setConnectedDevice(device);
              device.onDisconnected(this.onDeviceDisconnected);
              resolve(device);
            })
            .catch(e => {
              reject(e);
            });
        }
        else {
          const device = this.devices.get(id);
          this.setConnectedDevice(device);
          resolve(device);
        }
      })
    });
  }

  public disconnectFromDevice = async (): Promise<any> => {
    return Promise.resolve();
    // return this.manager.cancelDeviceConnection(this.connectedDevice.id);
  }

  public readCharacteristic = async (charUuid: string): Promise<boolean> => {
    try {
      if (!this.characteristicsBeingRead.has(charUuid)) {
        // mark char as being read so we don't re-read it immediately in case of another request
        this.characteristicsBeingRead.add(charUuid);

        // need to perform discovery first, otherwise all chars are still "hidden"
        const device: Device = await this.manager.discoverAllServicesAndCharacteristicsForDevice(this.connectedDevice.id);
        const chars: Characteristic[] = await this.manager.characteristicsForDevice(this.connectedDevice.id, UUID.service);
        const char = chars.find(char => char.uuid === charUuid);
        const charWithValue: Characteristic = await char.read();

        // save char so we can observe it in presenters
        this.characteristicsForConnectedDevice.set(charWithValue.uuid, charWithValue);
  
        return true;
      }

      return true;
    } catch (e) {
      throw e;
    }
    finally {
      // un-mark char so it can be read again
      this.characteristicsBeingRead.delete(charUuid);
    }
  }

  public writeCharacteristicForDevice = async (deviceId: string, charUuid: string, base64Message: string): Promise<Characteristic> => {
    const device: Device = await this.manager.discoverAllServicesAndCharacteristicsForDevice(this.connectedDevice.id);
    return this.manager.writeCharacteristicWithoutResponseForDevice(deviceId, UUID.service, charUuid, base64Message)
      .catch((e: Error) => {
        console.log(`Error writing characteristic: ${e.message}`);
        return null;
      });
  }

  // private

  private onStateChange = (state: State) => {
    console.log(`BLE manager state changed: ${state}`);
    switch (state) {
      case State.PoweredOn:
        this.startDeviceScan();
        break;
      // TODO
    }
  }

  private onDeviceDisconnected = (error?: Error, device?: models.IDevice) => {
    console.log(`${device.id} disconnected.`);
    // flush char subscriptions
    this.characteristicSubscriptions.forEach(s => s.remove());
    this.characteristicSubscriptions.clear();
    // flush characteristics
    this.characteristicsForConnectedDevice.clear();
    // remove connected device
    this.setConnectedDevice(null);
  }

  private onDeviceCharacteristicChanged = async (error?: Error, characteristic?: Characteristic) => {
    error && console.log(error.message);
    if (!characteristic) return;
    
    console.log(`Char value changed: ${characteristic.uuid}`);
    this.readCharacteristic(characteristic.uuid);
  }


  public async start(): Prosmise<void> {
    if (Platform.OS === 'android') {
      // android
      const bleState = await this.manager.state();
      console.log(bleState)
      if (bleState === State.PoweredOff) {
        this.manager.enable('ENABLE_BLE').then(() => {
          setTimeout(() => {
            this.startDeviceScan()
          }, 1000)
        })
      } else {
        this.startDeviceScan()
      }
    } else {
      // iOS
      this.startDeviceScan()
    }
  }


  public async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permissions granted')
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err)
        return false;
      }
    } else {  // iOS
      return true
    }
  }


  // private actions

  @action('UPDATE_DISCOVERED_DEVICES') private onDeviceDiscovered = (device?: Device) => {
    if (device === null || device.name == null) {
      return;
    }
    const updatedDevice = {...device, discoveredTimestamp: Date.now()/1000}
    this.devices.set(updatedDevice.id, updatedDevice);
    console.log('Ble device discovered', updatedDevice);
  }

  @action('SET_CONNECTED_DEVICE') public setConnectedDevice = async (device: models.IDevice) => {
    this.connectedDevice = device;
  }

}


decorate(BluetoothService, {
  devices: observable,
  connectedDevice: observable,
  characteristicsForConnectedDevice: observable,
})

export default BluetoothService;