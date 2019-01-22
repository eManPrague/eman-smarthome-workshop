declare module models {
  interface IDevice {
    id: string;
    name: string;
    rssi: number;
    txPowerLevel: number;
    mtu: number;
    isConnected: boolean;
    discoveredTimestamp: number;
    isConnecting: boolean;
  }

  interface ICharacteristic {
    uuid: string;
    value?: string;
  }

  interface IStringMessage {
    readonly value: string;
    base64Message(): Promise<string>;
  }

  interface ILightMessage {
    readonly state: boolean;
    base64Message(): Promise<string>;
  }

  interface ILightIntensityMessage {
    readonly value: number;
    base64Message(): Promise<string>;
  }

  interface ITemperatureMessage {
    readonly value: number;
    base64Message(): Promise<string>;
    valueDecimal: number;
  }

  interface IPressureMessage {
    readonly value: number;
    base64Message(): Promise<string>;
    valueDecimal: number;
  }



}