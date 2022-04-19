/* eslint-disable @typescript-eslint/no-explicit-any */
const sortByKey = (array: any[], key?: string) =>
  array.sort((a, b) => {
    const aKey = key ? a[key] : a;
    const bKey = key ? b[key] : b;
    if (aKey > bKey) return 1;
    if (aKey < bKey) return -1;
    return 0;
  });

export default sortByKey;
