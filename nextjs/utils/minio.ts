export const getFilePublicUrl = (path: string) => {
  const { MINIO_ENDPOINT, MINIO_BUCKET_NAME, MINIO_PORT } = process.env;
  const port = MINIO_PORT ? ':' + MINIO_PORT : '';
  return `https://${MINIO_ENDPOINT}${port}/${MINIO_BUCKET_NAME}/${path}`;
};
