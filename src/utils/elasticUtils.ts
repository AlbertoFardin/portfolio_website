import {
  initModule,
  deleteIndexES,
  fetchIndexES,
} from "@warda/node-utils/service/es";
import { HTTP_METHOD } from "@warda/node-utils/commons";
import { INDEX_NAME } from "../constants";

const indexNames = [
  INDEX_NAME.TABULAR,
  INDEX_NAME.MEDIA,
  INDEX_NAME.PUBLICATIONS,
  INDEX_NAME.READY,
];

const mappingDefault = {
  [INDEX_NAME.TABULAR]: { mappings: { properties: {} } },
  [INDEX_NAME.MEDIA]: { mappings: { properties: {} } },
  [INDEX_NAME.PUBLICATIONS]: { mappings: { properties: {} } },
  [INDEX_NAME.READY]: { mappings: { properties: {} } },
};

export const WARDA_TENANT = "warda";
const processEnvs = {
  elastic_host: "localhost",
  elastic_port: "9200",
  environment: "DEV",
  productId: "seecommerce",
  elastic_username: "test",
  elastic_password: "test",
};

export const initEsLib = () => {
  const {
    environment,
    productId,
    elastic_host,
    elastic_username,
    elastic_password,
    elastic_port,
  } = processEnvs;

  initModule({
    env: environment,
    productId,
    baseUrlEs: `${
      elastic_host === "localhost" ? "http" : "https"
    }://${elastic_host}:${elastic_port}`,
    esUsername: elastic_username,
    esPassword: elastic_password,
  });
};

const deleteAllIndexForTenant = async (
  tenantid: string,
  prefixTestSuite = ""
) =>
  Promise.all(
    indexNames
      .map((i) => prefixTestSuite + i)
      .map((i) => deleteIndexES(tenantid, i))
  );
const createIndexES = async (tenantid, index, mapping) =>
  fetchIndexES(tenantid, index, HTTP_METHOD.PUT, JSON.stringify(mapping));

const createAllIndexForTenant = async (
  tenantid: string,
  prefixTestSuite = "",
  mapping = mappingDefault
) =>
  Promise.all(
    indexNames.map((i) =>
      createIndexES(tenantid, prefixTestSuite + i, mapping[i])
    )
  );

export const deleteAndCreateIndexForTenant = async (
  tenantid: string,
  prefixTestSuite = "",
  mapping = mappingDefault
): Promise<string> => {
  try {
    await deleteAllIndexForTenant(tenantid, prefixTestSuite);
    await createAllIndexForTenant(tenantid, prefixTestSuite, mapping);
    return tenantid;
  } catch (err) {
    throw err;
  }
};
