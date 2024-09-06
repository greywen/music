import { Client } from 'minio';

const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_ENDPOINT } = process.env;

export default class minIOClient {
  static client = new Client({
    endPoint: MINIO_ENDPOINT!,
    useSSL: true,
    accessKey: MINIO_ACCESS_KEY!,
    secretKey: MINIO_SECRET_KEY!,
  });

  static presignedGetObject = async (
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
