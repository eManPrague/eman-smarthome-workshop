import { observable, autorun, decorate } from 'mobx';
import BaseMobXPresenter from '../base/BasePresenter';
import UUID from '../../services/Bluetooth/uuid';
import LightMessage from '../../models/LightMessage';
import LightIntensityMessage from '../../models/LightIntensityMessage';
import TemperatureMessage from '../../models/TemperatureMessage';
import PressureMessage from '../../models/PressureMessage';


class DeviceDetailMobXPresenter extends BaseMobXPresenter implements components.IDeviceDetailProps {
  lightMessage: models.ILightMessage = null;
  lightIntensityMessage: models.ILightIntensityMessage = null;
  temperatureMessage: models.ITemperatureMessage = null;
  pressureMessage: models.IPressureMessage = null;

  private autoReadCharsInterval?: number;

  async init() {
    const { bluetooth } = this.services;

    // subscribe to device connection changes
    this.addDisposer(autorun(() => {
      if (!bluetooth.connectedDevice) {
        this.services.navigation.goBack();
      }
    }));

    // subscribe to characteristic changes
    this.addDisposer((this.services.bluetooth.characteristicsForConnectedDevice as any).observe(async (change: { newValue: models.ICharacteristic }) => {
      const char = change.newValue;
      switch (char.uuid) {
        case UUID.charLight:
          this.lightMessage = await LightMessage.fromBase64(char.value);
          break;
        case UUID.charLightIntensity:
          this.lightIntensityMessage = await LightIntensityMessage.fromBase64(char.value);
          break;
        case UUID.charTemperature:
          this.temperatureMessage = await TemperatureMessage.fromBase64(char.value);
          break;
        case UUID.charPressure:
          this.pressureMessage = await PressureMessage.fromBase64(char.value);
          break;
      }
    }));

    try {
      await bluetooth.readCharacteristic(UUID.charTemperature);
    } catch (error) {
      console.log(`Error occurred during characteristic reading: ${error}`);
    }

    // set timer for auto reading characteristics
    this.setAutoReadCharsTimer();
  }

  changeLight = async (value: boolean) => {
    const { bluetooth } = this.services;
    const m = new LightMessage(value);
    const base64Message = await m.base64Message();
    bluetooth.writeCharacteristicForDevice(bluetooth.connectedDevice.id, UUID.charLight, base64Message);
  }

  changeLightIntensity = async (value: number) => {
    const { bluetooth } = this.services;
    const m = new LightIntensityMessage(value);
    const base64Message = await m.base64Message();
    bluetooth.writeCharacteristicForDevice(bluetooth.connectedDevice.id, UUID.charLightIntensity, base64Message);
  }

  public deinit() {
    super.deinit();
    const { bluetooth } = this.services;
    this.removeAutoReadCharsTimer();
    bluetooth.disconnectFromDevice();
  }

  private setAutoReadCharsTimer = async () => {
    this.readAllCharacteristics();
    this.autoReadCharsInterval = setInterval(this.readAllCharacteristics.bind(this), 1000);
  }
  
  private removeAutoReadCharsTimer = async () => {
    clearInterval(this.autoReadCharsInterval)
  }

  private readAllCharacteristics = async () => {
    const { bluetooth } = this.services;
    try {
      await bluetooth.readCharacteristic(UUID.charLight);
      await bluetooth.readCharacteristic(UUID.charLightIntensity);
      await bluetooth.readCharacteristic(UUID.charTemperature);
      await bluetooth.readCharacteristic(UUID.charPressure);
    } catch (error) {
      console.log(`Error occurred during auto characteristic reading: ${error}`);
    }
  }
}

decorate(DeviceDetailMobXPresenter, {
  lightMessage: observable,
  lightIntensityMessage: observable,
  temperatureMessage: observable,
  pressureMessage: observable
})


export default DeviceDetailMobXPresenter;
