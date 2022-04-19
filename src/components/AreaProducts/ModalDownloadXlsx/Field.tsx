import * as React from "react";
import { FIELD_IDS, ISelection } from "./reducer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FieldAttributes from "./FieldAttributes";
import FieldSelections from "./FieldSelections";
import LayoutTab from "../../../componentsBase/LayoutTab";

const FIELD_HEIGHT = 380;
const useStyles = makeStyles({
  layouttab: {
    width: 410,
  },
  field: {
    display: "flex",
    "flex-direction": "column",
    border: "1px solid #dddddd",
    height: FIELD_HEIGHT,
    "min-height": FIELD_HEIGHT,
    "max-height": FIELD_HEIGHT,
    "border-radius": 5,
    margin: "10px 0",
    overflow: "hidden",
  },
});

interface IField {
  dispatchModal: React.Dispatch<unknown>;
  fieldActiveId: FIELD_IDS;
  attributesInputted: string;
  attributesSelected: string[];
  attributesSaveSelection: boolean;
  selections: ISelection[];
  selectionsHash: string;
  selectionsSave: boolean;
}

const Field = ({
  dispatchModal,
  fieldActiveId,
  attributesInputted,
  attributesSelected,
  attributesSaveSelection,
  selections,
  selectionsHash,
  selectionsSave,
}: IField) => {
  const classes = useStyles({});

  return (
    <div className={classes.field}>
      <LayoutTab
        className={classes.layouttab}
        panels={[
          {
            id: FIELD_IDS.ATTRIBUTES,
            children: (
              <FieldAttributes
                dispatchModal={dispatchModal}
                attributesInputted={attributesInputted}
                attributesSelected={attributesSelected}
                selections={selections}
                attributesSaveSelection={attributesSaveSelection}
                selectionsHash={selectionsHash}
              />
            ),
          },
          {
            id: FIELD_IDS.SELECTIONS,
            children: (
              <FieldSelections
                dispatchModal={dispatchModal}
                selections={selections}
                selectionsSave={selectionsSave}
              />
            ),
          },
        ]}
        panelSelectedId={fieldActiveId}
        tabsVisible={false}
      />
    </div>
  );
};

export default Field;
