import { decodeBase64ToDataArray, encodeDataArrayToBase64 } from '../helpers/MessagePack';

class PressureMessage implements models.IPressureMessage {
  constructor(public value: number) {}

  static async fromBase64(encodedString: string): Promise<PressureMessage> {
    const [value] = await decodeBase64ToDataArray(encodedString);
    return new PressureMessage(value);
  }

  base64Message = (): Promise<string> => {
    return encodeDataArrayToBase64([this.value]);
  }

  get valueDecimal() {
    return this.value / 100;
  }
}

export default PressureMessage;