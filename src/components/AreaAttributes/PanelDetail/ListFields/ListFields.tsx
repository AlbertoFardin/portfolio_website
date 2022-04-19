import * as React from "react";
import { AttributeType } from "../../../../interfaces";
import getFields from "./getFields";
import IFieldsCmp from "../IFieldsCmp";
import FieldString from "./FieldString";
import FieldBool from "./FieldBool";
import FieldAtype from "./FieldAtype";
import FieldAttributeFamily from "./FieldAttributeFamily";
import FieldLevel from "./FieldLevel";
import { TypeCell } from "../../../../componentsBase/StickyGrid";
import IField from "./IField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FIELD_WIDTH } from "../../../../constants";

const useStyles = makeStyles({
  field: {
    margin: "25px 10px 5px",
    verticalAlign: "top",
    width: FIELD_WIDTH / 2,
  },
});

const fieldReadonlyUser = new Set(["editable"]);
const fieldReadonlyDefault = new Set(["editable", "carryOver"]);
const getFieldsId = (attributeType: AttributeType) => {
  const fieldsId = [
    "attributeFamily",
    "atype",
    "mandatory",
    "attributeName",
    "label",
    "level",
    "groupId",
    "exportable",
    "editable",
    "searchable",
    "carryOver",
  ];

  if (attributeType === AttributeType.USER) {
    fieldsId.push("multiCatalog");
    fieldsId.push("multiLanguage");
  }

  return fieldsId;
};

const ListFields = ({ columns, data, readOnly }: IFieldsCmp) => {
  const classes = useStyles({});

  const fieldsId = getFieldsId(data.attributeType);
  const fields = getFields(data, columns, fieldsId);
  const attUser = data.attributeType === AttributeType.USER;

  return (
    <>
      {fields.map(({ id, type, label }) => {
        const readOnlyCheck =
          readOnly ||
          (attUser ? fieldReadonlyUser : fieldReadonlyDefault).has(id);

        const p: IField = {
          key: id,
          id,
          label,
          value: data[id],
          readOnly: readOnlyCheck,
          className: classes.field,
          attributeType: data.attributeType,
        };

        if (id === "attributeFamily") return <FieldAttributeFamily {...p} />;
        if (id === "atype") return <FieldAtype {...p} />;
        if (id === "level") return <FieldLevel {...p} />;
        if (id === "multiLanguage" && !data.multiCatalog) return null;

        switch (type) {
          case TypeCell.Bool:
            return <FieldBool {...p} />;
          default:
            return <FieldString {...p} />;
        }
      })}
    </>
  );
};

export default ListFields;
