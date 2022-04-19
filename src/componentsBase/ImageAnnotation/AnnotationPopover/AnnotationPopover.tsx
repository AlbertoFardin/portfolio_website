/* eslint-disable */

import Divider from "@material-ui/core/Divider";
import Popover, { PopoverPosition } from "@material-ui/core/Popover";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Btn from "../../Btn";
import FieldMentions from "../../Field/FieldMentions";
import { draftId, IAnnotation, IAnnotationData } from "../interfaces";
import SelectorColor from "./SelectorColor";
import ToolbarUser from "./ToolbarUser";
import IUser from "../../IUser";
import * as Colors from "../../style/Colors";

const Flex1 = () => <div style={{ flex: 1 }} />;
const useStyle = makeStyles({
  paper: {
    padding: 10,
    overflow: "visible",
  },
  toolbar: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    margin: 0,
    padding: 0,
  },
  divider: {
    margin: "10px 0",
  },
  resolvedButton: {
    margin: "0 0 0 25px",
  },
  fieldtextarea: {
    margin: "15px 0",
    width: 250,
    flex: 1,
  },
});

interface IImageAnnotationPopover {
  anchorPosition?: PopoverPosition;
  annotation: IAnnotation;
  annotationOriginal: IAnnotation;
  colorTheme: string;
  colors?: string[];
  open?: boolean;
  onClose: () => void;
  onChange: (a: IAnnotationData, mentions: IUser[]) => void;
  onConfirm: (a: IAnnotationData, close?: boolean) => void;
  onDelete: () => void;
  onExited: () => void;
  readOnly?: boolean;
  users: IUser[];
}

const ImageAnnotationPopover = ({
  anchorPosition = { top: 0, left: 0 },
  annotation,
  annotationOriginal,
  colorTheme,
  colors = ["#ff0000"],
  open,
  onClose,
  onChange,
  onConfirm,
  onDelete,
  onExited,
  readOnly = false,
  users,
}: IImageAnnotationPopover) => {
  const classes = useStyle({});
  const [valueInEditing, setValueInEditing] = React.useState(false);
  const annotationId = annotation.data.id;
  const { editable, mentions } = annotation;
  const isDraft = annotationId === draftId;
  const inCreating = isDraft;
  const cbOnChange = React.useCallback(
    (t: string, newMentions: IUser[]) => {
      if (t !== annotation.data.value) {
        onChange({ value: t }, newMentions);
      }
    },
    [annotation.data.value, onChange]
  );

  React.useEffect(() => {
    if (!open) setValueInEditing(false);
  }, [open]);

  return (
    <Popover
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={() => {
        if (!valueInEditing) onClose();
      }}
      onExited={onExited}
      PaperProps={{
        className: classes.paper,
      }}
    >
      {!!editable && (editable.color || editable.resolved) ? (
        <>
          <div className={classes.toolbar}>
            {editable.color && colors.length > 1 ? (
              <SelectorColor
                colors={colors}
                annotation={annotation}
                onClick={(c) => {
                  if (!isDraft) {
                    const dateUpdated = new Date().getTime();
                    const changes = { color: c, dateUpdated };
                    onChange(changes, mentions);
                    onConfirm(changes);
                  } else {
                    onChange({ color: c }, mentions);
                  }
                }}
              />
            ) : null}
            <Flex1 />
            {editable.resolved && !isDraft ? (
              <Btn
                label="Resolved"
                labelPosition="left"
                className={classes.resolvedButton}
                icon={
                  annotation.data.resolved
                    ? "check_box"
                    : "check_box_outline_blank"
                }
                onClick={() => {
                  const changes = { resolved: !annotation.data.resolved };
                  onChange(changes, mentions);
                  onConfirm(changes);
                }}
              />
            ) : null}
          </div>
          <Divider className={classes.divider} />
        </>
      ) : null}

      <ToolbarUser annotation={annotation} />

      <FieldMentions
        users={users}
        readOnly={!valueInEditing && (readOnly || !inCreating)}
        autoFocus={inCreating}
        value={annotation.data.value}
        className={classes.fieldtextarea}
        onChange={cbOnChange}
      />
      {isDraft || readOnly ? null : (
        <div className={classes.toolbar}>
          {!!editable && editable.delete && !valueInEditing ? (
            <Btn
              color={Colors.Red}
              icon="delete"
              tooltip="Delete annotation"
              onClick={onDelete}
            />
          ) : null}
          <Flex1 />
          {!!editable && editable.value && !valueInEditing ? (
            <Btn
              color={Colors.Green}
              label="EDIT"
              onClick={() => setValueInEditing(true)}
              variant="bold"
            />
          ) : null}
          {valueInEditing ? (
            <Btn
              color={Colors.Green}
              label="SAVE"
              onClick={() => {
                const dateUpdated = new Date().getTime();
                setValueInEditing(false);
                onChange({ dateUpdated }, mentions);
                onConfirm({ dateUpdated });
              }}
              variant="bold"
            />
          ) : null}
          {valueInEditing ? (
            <Btn
              label="CANCEL"
              onClick={() => {
                setValueInEditing(false);
                onChange({ value: annotationOriginal.data.value }, mentions);
              }}
              variant="bold"
            />
          ) : null}
        </div>
      )}
      {!inCreating ? null : (
        <div className={classes.toolbar}>
          <Flex1 />
          <Btn
            disabled={!annotation.data.value}
            color={Colors.Green}
            label="POST"
            onClick={() =>
              onConfirm({ dateCreated: new Date().getTime() }, true)
            }
            variant="bold"
          />
          <Btn label="CANCEL" onClick={onClose} variant="bold" />
        </div>
      )}
    </Popover>
  );
};

export default ImageAnnotationPopover;
