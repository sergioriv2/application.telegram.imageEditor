import sharp from 'sharp';
import Stream from 'stream';

export class ImageService {
  private validMimeTypes: string[];
  constructor() {
    this.validMimeTypes = ['image/png', 'image/jpeg', 'image/tiff'];
  }

  isValidMimeType(mimeType: string): boolean {
    console.log({ mimeType });
    return this.validMimeTypes.includes(mimeType);
  }

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
      .png()
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
