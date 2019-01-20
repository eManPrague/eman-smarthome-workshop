declare module services {
  /**
   * Bluetooth service for discovering/managing devices and their characteristics.
   * 
   * @interface IBluetooth
   */
  interface IBluetooth {
    /**
     * Map of available devices discovered by the service.
     * 
     * @type {Map<string, models.IDevice>}
     * @memberof IBluetooth
     */
    readonly devices: Map<string, models.IDevice>;
    /**
     * Currently connected device.
     * 
     * @type {models.IDevice}
     * @memberof IApp
     */
    readonly connectedDevice: models.IDevice;
    /**
     * Map of available characteristics
     * 
     * @type {Map<string, Characteristic>}
     * @memberof IBluetooth
     */
    readonly characteristicsForConnectedDevice: Map<string, models.ICharacteristic>
    /**
     * Perform devices scan.
     * 
     * @returns {Promise<boolean>} 
     * @memberof IBluetooth
     */
    startDeviceScan(): Promise<boolean>;
    /**
     * Stop device scan.
     * 
     * @memberof IBluetooth
     */
    stopDeviceScan(): void;
    /**
     * Connect to device with id.
     * 
     * @param {string} deviceId 
     * @returns {Promise<models.IDevice>} 
     * @memberof IBluetooth
     */
    connectToDevice(deviceId: string): Promise<models.IDevice>;
    /**
     * Disconnect from device with id.
     * 
     * @param {string} deviceId 
     * @returns {Promise<any>} 
     * @memberof IBluetooth
     */
    disconnectFromDevice(): Promise<any>;
    /**
     * Read desired characteristic from device. Returns true on success.
     * Listen to observable characteristicsForConnectedDevice for char values.
     * 
     * @param {string} charUuid
     * @returns {Promise<boolean>} 
     * @memberof IBluetooth
     */
    readCharacteristic(charUuid: string): Promise<boolean>;
    /**
     * Write characteristic to device (value hase to be in base64)
     * 
     * @param {string} deviceId 
     * @param {string} charUuid
     * @param {string} base64Message 
     * @returns {Promise<string>} 
     * @memberof IBluetooth
     */
    writeCharacteristicForDevice(deviceId: string, charUuid: string, base64Message: string): Promise<any>;
    /**
     * Set device as an active one.
     * 
     * @param {models.IDevice} device 
     * @memberof IApp
     */
    setConnectedDevice(device: models.IDevice): void;
    /**
     * Requests permissions for ble.
     * 
     * @memberof IApp
     */
    requestPermission(): Promise<boolean>;
    
    start(): Prosmise<void>;
  }
  /**
   * Navigation throughout the app. Implemented as a separate service to be available within presenters.
   * 
   * @interface INavigation
   */
  interface INavigation {
    /**
     * Navigate to route.
     * 
     * @param {string} routeName 
     * @param {*} [params] 
     * @memberof INavigation
     */
    navigate(routeName: string, params?: any): void;
    /**
     * Go to previous screen
     * 
     * @memberof INavigation
     */
    goBack(): void;
    /**
     * Method for setting top level navigator normally accessible only from props of a React.Component.
     * 
     * @param {*} navigatorRef 
     * @memberof INavigation
     */
    setTopLevelNavigator(navigatorRef: any): void;
  }

  /**
   * Object agreggating all available services.
   * 
   * @interface IServices
   */
  interface IServices {
    /**
     * Reference to IBluetooth
     * 
     * @type {IBluetooth}
     * @memberof IServices
     */
    bluetooth: IBluetooth;
    /**
     * Reference to INavigation
     * 
     * @type {INavigation}
     * @memberof IServices
     */
    navigation: INavigation;
  }
}