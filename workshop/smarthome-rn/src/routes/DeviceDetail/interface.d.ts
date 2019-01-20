declare module components {
  interface IDeviceDetailProps {
    readonly lightMessage: models.ILightMessage;
    readonly lightIntensityMessage: models.ILightIntensityMessage;
    readonly temperatureMessage: models.ITemperatureMessage;
    readonly pressureMessage: models.IPressureMessage;

    changeLight(value: boolean): void;
    changeLightIntensity(value: number): void;
  }

  interface IDeviceDetailState {
    lightSwitch: boolean
  }

}