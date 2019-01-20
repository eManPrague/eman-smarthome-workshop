declare module components {
  interface IDevicesProps {
    readonly devices: models.IDevice[];
    readonly connectingTo: models.IDevice;
    
    selectDevice(index: number): void;
  }
}