const Buffer = require('buffer/').Buffer;

export const decodeBase64ToDataArray = (encodedString: string): Promise<any[]> => {
  return new Promise(resolve => {
    const buffer = Buffer.from(encodedString, 'base64');

    let value;
    if (buffer.length === 4) {
      value = buffer.readInt32BE(0);
    } else {
      value = buffer.readInt8(0);
    }
    resolve([value]);
  });
}

export const encodeDataArrayToBase64 = (value: any[]): Promise<string> => {
  return new Promise(resolve => {
    const base64 = Buffer.from(value, 'binary').toString('base64')
    resolve(base64);
  })
}


