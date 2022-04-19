import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SharePrivate from "./SharePrivate";
import ShareOrganiz from "./ShareOrganiz";
import Collapse from "@material-ui/core/Collapse";
import Toolbar from "@material-ui/core/Toolbar";
import * as Colors from "../../../componentsBase/style/Colors";
import Typography from "@material-ui/core/Typography";
import { IFileDetail, IShared, SharedRole } from "../../../interfaces";
import Btn from "../../../componentsBase/Btn";
import List from "@material-ui/core/List";
import getSharesPrivate from "./getSharesPrivate";

const useStyles = makeStyles({
  flex1: {
    flex: 1,
  },
  toolbar: {
    padding: "0 10px",
  },
  list: {
    position: "relative",
    overflow: "auto",
    "max-height": 270,
  },
  labelUnsavedChanges: {
    "font-style": "italic",
    "margin-right": 10,
  },
});

interface IPanelListShared {
  assetDatas: IFileDetail[];
  sharesToCreate: IShared[];
  sharesToEdited: IShared[];
  onChange: (userId: string, role: SharedRole) => void;
  onCancel: () => void;
  onSave: () => void;
}

const PanelListShared = ({
  assetDatas,
  sharesToCreate,
  sharesToEdited,
  onChange,
  onCancel,
  onSave,
}: IPanelListShared) => {
  const classes = useStyles({});
  return (
    <Collapse in={!!assetDatas.length && !sharesToCreate.length}>
      <List className={classes.list}>
        {getSharesPrivate(assetDatas).map(({ id, role }) => (
          <SharePrivate
            key={id}
            userId={id}
            userRole={role}
            sharesToEdited={sharesToEdited}
            onChange={onChange}
            assetDatas={assetDatas}
          />
        ))}
      </List>
      <ShareOrganiz
        assetDatas={assetDatas}
        sharesToEdited={sharesToEdited}
        onChange={onChange}
      />
      <Toolbar className={classes.toolbar}>
        <div className={classes.flex1} />
        {!sharesToEdited.length ? (
          <Btn
            color={Colors.Cyan}
            variant="bold"
            label="DONE"
            onClick={onCancel}
          />
        ) : (
          <>
            <Typography
              variant="caption"
              className={classes.labelUnsavedChanges}
              children="Unsaved changes"
            />
            <Btn
              color={Colors.Green}
              variant="bold"
              label="SAVE"
              onClick={onSave}
            />
          </>
        )}
      </Toolbar>
    </Collapse>
  );
};

export default PanelListShared;
