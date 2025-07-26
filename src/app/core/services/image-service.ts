import sharp from 'sharp';
import Stream from 'stream';

export class ImageService {
  constructor() {}

  async cropImage(buffer: Buffer, width: number, height: number) {
    const widthOffsetCalc = Math.floor((width - 512) / 2);
    const leftOffsetCalc = Math.floor((height - 512) / 2);

    return await sharp(buffer)
      .extract({
        top: leftOffsetCalc,
        left: widthOffsetCalc,
        width: 512,
        height: 512,
      })
      .toBuffer();
  }

  async streamToBuffer(readableStream: Stream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
