import { ICategory } from "../../../../componentsBase/ChipCategory";
import { TypeCell, IThumbnail } from "../../../../componentsBase/StickyGrid";
import { KEY_ROOT_ID } from "../../../../constants";
import { AttributeType, ATypeColumn } from "../../../../interfaces";
import getGridItems from "../getGridItems";

const catalogId = "EMEA";
const languageId = "en";
const decorateCellThumbnails = ({ id }): IThumbnail[] => [
  { id: `thumbId_${id}`, srcUrl: `thumbUrl_${id}` },
];
const decorateCellCategories = ({ id }): ICategory[] => [
  { id: `catId_${id}`, label: `catLabel_${id}` },
];

describe("getGridItems", () => {
  test("getGridItems - no thumbnails", () => {
    const columns = [
      {
        id: "_id",
        label: "_label",
        atype: ATypeColumn.string,
        type: TypeCell.String,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "product://",
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));
    const items = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "root",
      },
    ];
    expect(items).toEqual(
      getGridItems({
        items,
        columns,
        catalogId,
        languageId,
        decorateCellThumbnails,
        decorateCellCategories,
      })
    );
  });

  test("getGridItems - with thumbnails", () => {
    const columns = [
      {
        id: "colString",
        label: "_label",
        atype: ATypeColumn.string,
        type: TypeCell.String,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "product://",
        scope: [],
      },
      {
        id: "colMultiThumb",
        label: "_label",
        atype: ATypeColumn.string,
        type: TypeCell.MultipleThumbnail,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "product://",
        scope: [],
      },
      {
        id: "colThumb",
        label: "_label",
        atype: ATypeColumn.string,
        type: TypeCell.Thumbnail,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "product://",
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));
    const items = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "root",
        colMultiThumb: [
          {
            id: "thumbId_1",
            srcUrl: "thumbUrl_1",
          },
        ],
        colThumb: [
          {
            id: "thumbId_1",
            srcUrl: "thumbUrl_1",
          },
        ],
      },
      {
        id: "2",
        version: 1,
        [KEY_ROOT_ID]: "root",
        colMultiThumb: [
          {
            id: "thumbId_2",
            srcUrl: "thumbUrl_2",
          },
        ],
        colThumb: [
          {
            id: "thumbId_2",
            srcUrl: "thumbUrl_2",
          },
        ],
      },
    ];
    expect(items).toEqual(
      getGridItems({
        items,
        columns,
        catalogId,
        languageId,
        decorateCellThumbnails,
        decorateCellCategories,
      })
    );
  });
});
