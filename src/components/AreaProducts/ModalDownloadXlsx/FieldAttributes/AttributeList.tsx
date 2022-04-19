import * as React from "react";
import List from "@material-ui/core/List";
import AttributeListItem from "./AttributeListItem";
import { ContextColumns } from "../../contexts";

interface IAttributeList {
  attributesInputted: string;
  attributesSelected: string[];
  dispatchModal: React.Dispatch<unknown>;
}

const AttributeList = ({
  attributesInputted,
  attributesSelected,
  dispatchModal,
}: IAttributeList) => {
  const columns = React.useContext(ContextColumns);

  return (
    <List style={{ flex: 1, overflow: "auto" }}>
      {columns
        .filter(({ label, attributeStructureId }) => {
          const input = attributesInputted.toLocaleLowerCase();
          const match = label.toLocaleLowerCase().includes(input);
          return !!attributeStructureId && match;
        })
        .sort((a, b) => {
          if (a.label > b.label) return 1;
          if (a.label < b.label) return -1;
          return 0;
        })
        .map(({ id, label, multiCatalog, multiLanguage, scope }) => (
          <AttributeListItem
            key={id}
            id={id}
            label={label}
            multiCatalog={multiCatalog}
            multiLanguage={multiLanguage}
            scope={scope}
            attributesInputted={attributesInputted}
            attributesSelected={attributesSelected}
            dispatchModal={dispatchModal}
          />
        ))}
    </List>
  );
};

export default AttributeList;
