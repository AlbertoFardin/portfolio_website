export default (path: string): string => {
  switch (process.env.ENV) {
    case "prod":
      return `https://api.wardacloud.com${path}`;
    default:
      return `https://api-${process.env.ENV}.wardacloud.com${path}`;
  }
};
