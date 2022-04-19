import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
import apiUrls from "./endpoints";
import { AUTHORIZATION_TOKEN } from "../constants";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

const httpLink = createHttpLink({
  uri: apiUrls.endpointGraphql.url(),
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get(AUTHORIZATION_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token,
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
  link: authLink.concat(httpLink),
});

interface IResultFromListAnnotationsCountByEntityIds {
  listProductResolved: {
    __typename: string;
    cid1: string;
    annotations: { __typename: string; cid2: string; count: number }[];
  }[];
  listProductNotResolved: {
    __typename: string;
    cid1: string;
    annotations: { __typename: string; cid2: string; count: number }[];
  }[];
}

interface IResultAnnotationNormalized {
  [mediaId: string]: { [viewId: string]: boolean };
}

export const formatAnnotationsListFromListEntity = (
  fromServerValue: IResultFromListAnnotationsCountByEntityIds
): IResultAnnotationNormalized => {
  // a) per ogni cid1 trovo le viste con sole annotazioni non risolte
  // b) per ogni cd1 trovo le viste con annotazione risolte
  const result = {};
  fromServerValue.listProductNotResolved.forEach((element) => {
    result[element.cid1] = element.annotations.reduce((acc, cValue) => {
      acc[cValue.cid2] = true;
      return acc;
    }, {});
  });
  fromServerValue.listProductResolved.forEach((element) => {
    // caso in cui un certo prodotto non ha viste non risolte
    if (!result[element.cid1]) {
      result[element.cid1] = element.annotations.reduce((acc, cValue) => {
        acc[cValue.cid2] = false;
        return acc;
      }, {});
    } else {
      element.annotations.forEach(({ cid2 }) => {
        if (!result[element.cid1][cid2]) {
          result[element.cid1][cid2] = false;
        }
      });
    }
  });

  return result;
};

export const getFileIdResolved = (
  input: unknown
): { fileId: string; resolved: boolean }[] => {
  const result = [];
  Object.keys(input).forEach((vId) => {
    Object.keys(input[vId]).forEach((fId) => {
      result.push({
        fileId: fId,
        resolved: !input[vId][fId],
      });
    });
  });
  return result;
};

export const formatMediaAnnotationsByViews = (fromServer: {
  listResolvedByMedia: { cid2: string; cid3: string; count: number }[];
  listUnResolvedByMedia: { cid2: string; cid3: string; count: number }[];
}): {
  [id: string]: { [v: string]: boolean };
} => {
  const result = {};
  fromServer.listResolvedByMedia.forEach((a) => {
    if (!result[a.cid2]) {
      result[a.cid2] = {};
    }
    result[a.cid2][a.cid3] = false;
  });
  fromServer.listUnResolvedByMedia.forEach((a) => {
    if (!result[a.cid2]) {
      result[a.cid2] = {};
    }
    result[a.cid2][a.cid3] = true;
  });
  return result;
};

export const mapAnnotationsByEntityIds = async (
  entityIds: string[]
): Promise<{
  [entityId: string]: {
    unresolved: string[];
    resolved: string[];
  };
}> => {
  const querys = entityIds.map((entityId, index) => {
    return `${"resolved" + index}: listCid2Cid3AnnotationCount(
            cid1: ${JSON.stringify(entityId)},
            resolved: true
            ) {fileId: cid3},
            ${"unresolved" + index}: listCid2Cid3AnnotationCount(
              cid1: ${JSON.stringify(entityId)},
              resolved: false
              ) {fileId: cid3}`;
  });

  const result: {
    data: {
      [list: string]: Array<{
        fileId: string;
        viewId: string;
      }>;
    };
  } = await client.query({
    query: gql`query ListCid2Cid3AnnotationCount {${querys.join()}}`,
  });

  return entityIds.reduce((acc, entityId, index) => {
    const data = result.data;
    acc[entityId] = {
      resolved: (data["resolved" + index] || []).map((c) => c.fileId),
      unresolved: (data["unresolved" + index] || []).map((c) => c.fileId),
    };
    return acc;
  }, {});
};
