import { decodeBase64ToDataArray, encodeDataArrayToBase64 } from '../helpers/MessagePack';

class LightMessage implements models.ILightMessage {
  constructor(public state: boolean) {}

  static async fromBase64(encodedString: string): Promise<LightMessage> {
    const [value] = await decodeBase64ToDataArray(encodedString);
    return new LightMessage(value);
  }

  base64Message = (): Promise<string> => {
    return encodeDataArrayToBase64([this.state]);
  }
}

export default LightMessage;
