// taken from https://polidea.github.io/react-native-ble-plx/
// feel free to add more methods/props if necessary

declare module 'react-native-ble-plx' {
  class BleManager {
    setLogLevel(level: string): void;
    state(): Promise<State>;
    onStateChange(state: State): void;
    startDeviceScan(uuids: string[], config: any, callback: (error?: Error, device?: Device) => void): void;
    stopDeviceScan(): void;
    isDeviceConnected(deviceIdentifier: string): Promise<boolean>;
    readCharacteristicForDevice(
      deviceIdentifier: string,
      serviceUUID: string,
      characteristicUUID: string,
      transactionId?: string,
    ): Promise<Characteristic>;
    writeCharacteristicWithoutResponseForDevice(
      deviceIdentifier: string,
      serviceUUID: string,
      characteristicUUID: string,
      base64Value: string,
      transactionId?: string): Promise<Characteristic>
    connectToDevice(
      deviceIdentifier: string,
      options?: any,
    ): Promise<Device>;
    monitorCharacteristicForDevice(
      deviceIdentifier: string,
      serviceUUID: string,
      characteristicUUID: string,
      listener: (error?: Error, characteristic?: Characteristic) => void,
      transactionId?: string
    ): Subscription;
    monitorCharacteristicForService(
      serviceUUID: string,
      characteristicUUID: string,
      listener: (error?: Error, characteristic?: Characteristic) => void,
      transactionId?: string
    ): Subscription
    cancelDeviceConnection(deviceIdentifier: string): Promise<Device>;
    discoverAllServicesAndCharacteristicsForDevice(deviceIdentifier: string): Promise<Device>;
    characteristicsForDevice(id: string, serviceUUID: string): Promise<any>;
    enable(transactionId?: string): Promise<BleManager>;
  }

  export interface Characteristic extends models.ICharacteristic {
    /**
     * Characteristic unique identifier
     * @private
     */
    id: string;
    /**
     * Characteristic UUID
     * @private
     */
    uuid: string;
    /**
     * Service's ID to which characteristic belongs
     * @private
     */
    serviceID: string;
    /**
     * Service's UUID to which characteristic belongs
     * @private
     */
    serviceUUID: string;
    /**
     * Device's ID to which characteristic belongs
     * @private
     */
    deviceID: string;
    /**
     * True if characteristic can be read
     * @private
     */
    isReadable: boolean;
    /**
     * True if characteristic can be written with response
     * @private
     */
    isWritableWithResponse: boolean;
    /**
     * True if characteristic can be written without response
     * @private
     */
    isWritableWithoutResponse: boolean;
    /**
     * True if characteristic can monitor value changes.
     * @private
     */
    isNotifiable: boolean;
    /**
     * True if characteristic is monitoring value changes without ACK.
     * @private
     */
    isNotifying: boolean;
    /**
     * True if characteristic is monitoring value changes with ACK.
     * @private
     */
    isIndicatable: boolean;
    /**
     * Characteristic value if present
     * @private
     */
    value?: string;
    read(): Promise<Characteristic>;
    monitor(listener: (error?: Error, characteristic?: Characteristic) => void): Subscription;
  }

  interface Device extends models.IDevice {
    onDisconnected(listener: (error?: Error, device?: Device) => void): Subscription;
  }

  interface Subscription {
    remove: Function;
  }

  enum State {
    PoweredOn = 'PoweredOn',
    PoweredOff = 'PoweredOff'
  }
}