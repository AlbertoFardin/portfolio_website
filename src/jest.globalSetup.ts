import { initEsLib } from "./utils/elasticUtils";

module.exports = async () => {
  initEsLib();
  process.env.TZ = "UTC";
};
