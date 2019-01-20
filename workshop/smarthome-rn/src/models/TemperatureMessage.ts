import { decodeBase64ToDataArray, encodeDataArrayToBase64 } from '../helpers/MessagePack';

class TemperatureMessage implements models.ITemperatureMessage {
  constructor(public value: number) {}

  static async fromBase64(encodedString: string): Promise<TemperatureMessage> {
    const [value] = await decodeBase64ToDataArray(encodedString);
    return new TemperatureMessage(value);
  }

  base64Message = (): Promise<string> => {
    return encodeDataArrayToBase64([this.value]);
  }

  get valueDecimal() {
    return this.value / 100;
  }
}

export default TemperatureMessage;