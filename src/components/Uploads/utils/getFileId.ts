const getFileId = (i: File): string => {
  const { name, type, size, lastModified, webkitRelativePath } = i;
  return `${name}_${type}_${size}_${lastModified}_${webkitRelativePath}`;
};
export default getFileId;
