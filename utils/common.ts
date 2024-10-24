export function getFileNameAndExtension(filePath: string): {
  name: string;
  extension: string;
} {
  const lastDotIndex = filePath.lastIndexOf('.');
  const name = filePath.substring(0, lastDotIndex);
  const extension = filePath.substring(lastDotIndex + 1);

  return { name, extension };
}
