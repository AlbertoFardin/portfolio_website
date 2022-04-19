import * as React from "react";
import { FieldSelect, IFieldSelectItem } from "../../../componentsBase/Field";
import { IFileDetail, ITag, TagColor } from "../../../interfaces";

const getId = ({ id, type }: ITag): string => `${id}_${type}`;

interface ITagSelectorReadOnly {
  files: IFileDetail[];
  label?: string;
}

const TagSelectorReadOnly = ({ files, label }: ITagSelectorReadOnly) => {
  const tags: ITag[] = files.reduce((acc: ITag[], { tags }) => {
    const t = new Set(acc.map(getId));

    (tags || []).forEach((tag) => {
      if (!t.has(getId(tag))) acc.push(tag);
    });

    return acc;
  }, []);
  const value: IFieldSelectItem[] = tags.map(({ name, type }) => {
    return {
      id: name,
      label: name,
      selected: true,
      style: {
        backgroundColor: TagColor[type],
        borderRadius: 5,
        padding: "0 10px",
      },
    };
  });

  return (
    <FieldSelect
      style={{ margin: "0 0 30px 0" }}
      label={label}
      value={value}
      readOnly
    />
  );
};

export default TagSelectorReadOnly;
