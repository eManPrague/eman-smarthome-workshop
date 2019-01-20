import { decodeBase64ToDataArray, encodeDataArrayToBase64 } from '../helpers/MessagePack';

class LightIntensityMessage implements models.ILightIntensityMessage {
  constructor(public value: number) {}

  static async fromBase64(encodedString: string): Promise<LightIntensityMessage> {
    const [value] = await decodeBase64ToDataArray(encodedString);
    return new LightIntensityMessage(value);
  }

  base64Message = (): Promise<string> => {
    return encodeDataArrayToBase64([this.value]);
  }
}

export default LightIntensityMessage;