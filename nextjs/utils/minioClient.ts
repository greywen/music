import { Client } from 'minio';

const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_ENDPOINT } = process.env;

const minIOClient = new Client({
  endPoint: MINIO_ENDPOINT!,
  useSSL: true,
  accessKey: MINIO_ACCESS_KEY!,
  secretKey: MINIO_SECRET_KEY!,
});

export async function presignedGetObject(
  bucketName: string,
  objectName: string,
  expires?: number,
  respHeaders?: Date,
  requestDate?: Date
) {
  return await minIOClient.presignedGetObject(
    bucketName,
    objectName,
    expires,
    respHeaders,
    requestDate
  );
}
