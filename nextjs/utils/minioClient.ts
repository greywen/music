import { Client } from 'minio';

class minIOClient {
  client: Client;
  constructor() {
    const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_ENDPOINT } = process.env;
    this.client = new Client({
      endPoint: MINIO_ENDPOINT!,
      useSSL: true,
      accessKey: MINIO_ACCESS_KEY!,
      secretKey: MINIO_SECRET_KEY!,
    });
  }

  presignedGetObject = async (
    bucketName: string,
    objectName: string,
    expires?: number,
    respHeaders?: Date,
    requestDate?: Date
  ) => {
    return await this.client.presignedGetObject(
      bucketName,
      objectName,
      expires,
      respHeaders,
      requestDate
    );
  };
}

export default new minIOClient();
