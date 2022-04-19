import { gql } from "@apollo/client";

export const GET_MEDIA_ANNOTATIONS = gql`
  query GetAnnotation($fileId: ID!, $entityId: ID!) {
    getAnnotationByCid3(cid3: $fileId) {
      id
      createdby
      resolved
      data
    }
    listCid2Cid3AnnotationCountNotResolved: listCid2Cid3AnnotationCount(
      cid1: $entityId
      resolved: false
    ) {
      cid2
      cid3
      count
    }
    listCid2Cid3AnnotationCountResolved: listCid2Cid3AnnotationCount(
      cid1: $entityId
      resolved: true
    ) {
      cid2
      cid3
      count
    }
  }
`;

export const ADD_ANNOTATION = gql`
  mutation InsertMutation(
    $cid1: String!
    $cid2: String!
    $cid3: String!
    $data: AWSJSON!
  ) {
    insertAnnotation(cid1: $cid1, cid2: $cid2, cid3: $cid3, data: $data) {
      id
      createdby
      data
    }
  }
`;

export const REMOVE_ANNOTATION = gql`
  mutation DeleteMutation($id: String!) {
    deleteAnnotation(id: $id) {
      id
      updatedby
      data
    }
  }
`;

export const RESOLVE_ANNOTATION = gql`
  mutation ResolveMutation($id: String!, $resolved: Boolean) {
    resolveAnnotation(id: $id, resolved: $resolved) {
      id
      updatedby
      data
    }
  }
`;

export const UPDATE_RESOLVE = gql`
  mutation UpdateMutation($id: String!, $data: AWSJSON!) {
    updateAnnotation(id: $id, data: $data) {
      id
      updatedby
      data
    }
  }
`;
