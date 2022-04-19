import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ICopyright } from "../../../../interfaces";
import FieldInfo, { IFieldType } from "./FieldInfo";

const useStyles = makeStyles({
  containerFields: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    "padding-bottom": 20,
  },
});

interface IInfoCopyright {
  onChange: (id: string, value) => void;
  copyrightSaved: ICopyright;
  copyrightDirty: ICopyright;
}

const InfoCopyright = ({
  onChange,
  copyrightSaved,
  copyrightDirty,
}: IInfoCopyright) => {
  const classes = useStyles({});
  const onChangeText = React.useCallback(
    (id, text: string) => {
      if (text === null) onChange(id, null);
      else onChange(id, text || undefined);
    },
    [onChange]
  );
  const onChangeDate = React.useCallback(
    (id, date: number) => {
      if (date === null) onChange(id, null);
      else onChange(id, !date ? date : new Date(date).toISOString());
    },
    [onChange]
  );

  return (
    <div className={classes.containerFields}>
      <FieldInfo
        dataSaved={copyrightSaved}
        dataDirty={copyrightDirty}
        fieldId="author"
        fieldLabel="Author"
        fieldType={IFieldType.TEXTINPUT}
        onChange={onChangeText}
      />
      <FieldInfo
        dataSaved={copyrightSaved}
        dataDirty={copyrightDirty}
        fieldId="agency"
        fieldLabel="Agency"
        fieldType={IFieldType.TEXTINPUT}
        onChange={onChangeText}
      />
      <FieldInfo
        dataSaved={copyrightSaved}
        dataDirty={copyrightDirty}
        fieldId="expirationDate"
        fieldLabel="Copyright expiration date"
        fieldType={IFieldType.DATE}
        onChange={onChangeDate}
      />
      <FieldInfo
        dataSaved={copyrightSaved}
        dataDirty={copyrightDirty}
        fieldId="validFrom"
        fieldLabel="Copyright validity"
        fieldType={IFieldType.DATE}
        onChange={onChangeDate}
      />
      <FieldInfo
        dataSaved={copyrightSaved}
        dataDirty={copyrightDirty}
        fieldId="copyrightNotes"
        fieldLabel="Copyrights notes"
        fieldType={IFieldType.TEXTAREA}
        onChange={onChangeText}
      />
    </div>
  );
};

export default InfoCopyright;
