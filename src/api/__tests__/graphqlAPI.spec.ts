import {
  formatAnnotationsListFromListEntity,
  formatMediaAnnotationsByViews as formatMediaUnresolvedAnnotationsByViews,
  getFileIdResolved,
} from "../graphqlAPI";

it("test format annotation NOT resolved by products", () => {
  const expectedValue = {
    "product://03wQdhpgGekH9OtW/color:111": {
      B: true,
      C: true,
      D: false,
    },
    "product://03wQdhpgGekH9OtW/color:222": {
      A: false,
      F: true,
      G: true,
    },
  };
  const fromServerValue = {
    listProductResolved: [
      {
        __typename: "CorrelationId1AnnotationCount",
        cid1: "product://03wQdhpgGekH9OtW/color:111",
        annotations: [
          { __typename: "AnnotationCid3Count", cid2: "B", count: 1 },
          { __typename: "AnnotationCid3Count", cid2: "D", count: 1 },
        ],
      },
      {
        __typename: "CorrelationId1AnnotationCount",
        cid1: "product://03wQdhpgGekH9OtW/color:222",
        annotations: [
          { __typename: "AnnotationCid3Count", cid2: "A", count: 1 },
          { __typename: "AnnotationCid3Count", cid2: "F", count: 1 },
        ],
      },
    ],
    listProductNotResolved: [
      {
        __typename: "CorrelationId1AnnotationCount",
        cid1: "product://03wQdhpgGekH9OtW/color:111",
        annotations: [
          { __typename: "AnnotationCid3Count", cid2: "B", count: 1 },
          { __typename: "AnnotationCid3Count", cid2: "C", count: 2 },
        ],
      },
      {
        __typename: "CorrelationId1AnnotationCount",
        cid1: "product://03wQdhpgGekH9OtW/color:222",
        annotations: [
          { __typename: "AnnotationCid3Count", cid2: "G", count: 15 },
          { __typename: "AnnotationCid3Count", cid2: "F", count: 1 },
        ],
      },
    ],
  };
  expect(expectedValue).toEqual(
    formatAnnotationsListFromListEntity(fromServerValue)
  );
});

it("test format annotation NOT resolved by single product", () => {
  const expectedValue = {
    B: {
      "2bf70ca1-1e0b-417e-b869-0ba6ef80d750": true,
      "4b553ba0-9b71-449e-a1df-8e1c73d8b3eb": true,
      "2bf70ca1-1e0b-417e-b869-0ba6ef8421312": false,
    },
    D1: {
      "2be2f122-0048-4299-9bfe-8d0ec81880e9": true,
    },
  };
  const fromServerValue = {
    listResolvedByMedia: [
      {
        cid2: "B",
        cid3: "2bf70ca1-1e0b-417e-b869-0ba6ef80d750",
        count: 3,
      },
      {
        cid2: "B",
        cid3: "2bf70ca1-1e0b-417e-b869-0ba6ef8421312",
        count: 3,
      },
    ],
    listUnResolvedByMedia: [
      {
        cid2: "B",
        cid3: "2bf70ca1-1e0b-417e-b869-0ba6ef80d750",
        count: 1,
      },
      {
        cid2: "B",
        cid3: "4b553ba0-9b71-449e-a1df-8e1c73d8b3eb",
        count: 1,
      },
      {
        cid2: "D1",
        cid3: "2be2f122-0048-4299-9bfe-8d0ec81880e9",
        count: 2,
      },
    ],
  };
  expect(expectedValue).toEqual(
    formatMediaUnresolvedAnnotationsByViews(fromServerValue)
  );
});

it.only("test format annotation NOT resolved by single product", () => {
  const expectedValue = {
    B: {
      "2bf70ca1-1e0b-417e-b869-0ba6ef80d750": true,
      "4b553ba0-9b71-449e-a1df-8e1c73d8b3eb": true,
    },
    D1: {
      "2be2f122-0048-4299-9bfe-8d0ec81880e9": true,
    },
  };
  const fromServerValue = {
    listResolvedByMedia: [
      {
        cid2: "B",
        cid3: "2bf70ca1-1e0b-417e-b869-0ba6ef80d750",
        count: 3,
        __typename: "AnnotationCid2Cid3Count",
      },
      {
        cid2: "B",
        cid3: "4b553ba0-9b71-449e-a1df-8e1c73d8b3eb",
        count: 3,
        __typename: "AnnotationCid2Cid3Count",
      },
      {
        cid2: "D1",
        cid3: "2be2f122-0048-4299-9bfe-8d0ec81880e9",
        count: 1,
        __typename: "AnnotationCid2Cid3Count",
      },
    ],
    listUnResolvedByMedia: [
      {
        cid2: "B",
        cid3: "2bf70ca1-1e0b-417e-b869-0ba6ef80d750",
        count: 1,
        __typename: "AnnotationCid2Cid3Count",
      },
      {
        cid2: "B",
        cid3: "4b553ba0-9b71-449e-a1df-8e1c73d8b3eb",
        count: 6,
        __typename: "AnnotationCid2Cid3Count",
      },
      {
        cid2: "D1",
        cid3: "2be2f122-0048-4299-9bfe-8d0ec81880e9",
        count: 2,
        __typename: "AnnotationCid2Cid3Count",
      },
    ],
  };
  expect(expectedValue).toEqual(
    formatMediaUnresolvedAnnotationsByViews(fromServerValue)
  );
});

it.only("test format annotation NOT resolved by single product", () => {
  const inputValue = {
    B: {
      "2bf70ca1-1e0b-417e-b869-0ba6ef80d750": true,
      "4b553ba0-9b71-449e-a1df-8e1c73d8b3eb": true,
      "2bf70ca1-1e0b-417e-b869-0ba6ef8421312": false,
    },
    D1: {
      "2be2f122-0048-4299-9bfe-8d0ec81880e9": true,
    },
  };
  const expectedValues = [
    {
      fileId: "2bf70ca1-1e0b-417e-b869-0ba6ef80d750",
      resolved: false,
    },
    {
      fileId: "4b553ba0-9b71-449e-a1df-8e1c73d8b3eb",
      resolved: false,
    },
    {
      fileId: "2bf70ca1-1e0b-417e-b869-0ba6ef8421312",
      resolved: true,
    },
    {
      fileId: "2be2f122-0048-4299-9bfe-8d0ec81880e9",
      resolved: false,
    },
  ];
  expect(expectedValues).toEqual(getFileIdResolved(inputValue));
});
