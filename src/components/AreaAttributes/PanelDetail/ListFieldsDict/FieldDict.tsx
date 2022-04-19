import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import { IDictionary } from "../../../../interfaces";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  row: {
    display: "flex",
    margin: "2px 0",
  },
  rowLabel: {
    width: 80,
    margin: "3px 0",
  },
  rowInput: {
    outline: 0,
    border: `1px solid ${Colors.Gray2}`,
    borderRadius: 5,
    resize: "none",
    fontFamily: "monospace",
    fontSize: 11,
    backgroundColor: "transparent",
    width: "-webkit-fill-available",
    padding: 5,
  },
});

interface IRow {
  label: string;
  value?: string;
}
const Row = ({ label, value }: IRow) => {
  const classes = useStyles({});
  if (!value) return null;
  return (
    <div className={classes.row}>
      <Typography
        className={classes.rowLabel}
        variant="body2"
        children={label}
      />
      {label === "value" ? (
        <textarea
          className={classes.rowInput}
          style={{ height: 60 }}
          value={value}
          readOnly
        />
      ) : (
        <input className={classes.rowInput} value={value} readOnly />
      )}
    </div>
  );
};

const FormDictionary = ({
  code,
  value,
  dictionaryId,
  catalog,
}: IDictionary) => (
  <div
    style={{
      margin: "10px 5px",
      padding: 10,
      borderRadius: 5,
      backgroundColor: Colors.Gray4,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Row label="id" value={dictionaryId} />
    <Row label="code" value={code} />
    <Row label="catalog" value={catalog} />
    <Row label="value" value={JSON.stringify(value, null, "\t")} />
  </div>
);

export default FormDictionary;
