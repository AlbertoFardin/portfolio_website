import * as Colors from "../../componentsBase/style/Colors";
import Btn from "../../componentsBase/Btn";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import hexToRgbA from "../../componentsBase/utils/hexToRgbA";
import Checkbox from "./Checkbox";
import getTitle from "./getTitle";
import Modal from "../Modal";

interface IStyles {
  alert: boolean;
}
const useStyles = makeStyles({
  modaldeletemedia: {
    width: "fit-content",
    "min-width": 100,
    "max-width": 2000,
    "min-height": 100,
    margin: 0,
    position: "relative",
    overflow: "hidden",
  },
  subtitle: {
    "border-radius": 5,
    "border-style": "solid",
    "border-width": 1,
    "background-color": ({ alert }: IStyles) =>
      alert ? hexToRgbA(Colors.Red, 0.2) : "transparent",
    "border-color": ({ alert }: IStyles) =>
      alert ? Colors.Red : "transparent",
    "& *": {
      color: ({ alert }: IStyles) => (alert ? Colors.Red : Colors.Gray1),
    },
  },
  flex1: {
    flex: 1,
  },
});

interface ICheck {
  id: string;
  label: string;
  selected?: boolean;
}

interface IModalMediasDelete {
  medias: { filename: string }[];
  checks: ICheck[];
  open: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalMediasDelete = ({
  medias,
  checks: checkInit,
  open,
  loading = false,
  onConfirm,
  onCancel,
}: IModalMediasDelete) => {
  const [alert, setAlert] = React.useState(false);
  const [checks, setChecks] = React.useState(checkInit);
  const classes = useStyles({ alert });
  const cbOnChange = React.useCallback(
    (id: string, selected: boolean) => {
      const newChecks = Array.from(checks);
      const index = newChecks.findIndex((c) => c.id === id);
      newChecks[index].selected = selected;
      setChecks(newChecks);
    },
    [checks]
  );
  const cbOnConfirm = React.useCallback(() => {
    const missSelected = checks.find(({ selected }) => !selected);
    if (missSelected) setAlert(true);
    else onConfirm();
  }, [checks, onConfirm]);

  React.useEffect(() => {
    if (open) {
      setAlert(false);
      setChecks(checkInit);
    }
  }, [checkInit, open]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Delete media"
      loading={loading}
      content={
        <>
          <div className={classes.subtitle}>
            <Typography variant="subtitle2">
              <span children={getTitle(medias)} />
              <br />
              <span children="Please confirm you understand the ramification:" />
            </Typography>
          </div>
          {checks.map(({ id, label, selected }) => (
            <Checkbox
              key={id}
              id={id}
              error={alert}
              label={label}
              checked={selected}
              onChange={cbOnChange}
            />
          ))}
        </>
      }
      actions={
        <>
          <div className={classes.flex1} />
          <Btn variant="bold" label="CANCEL" onClick={onCancel} />
          <Btn
            variant="bold"
            label="DELETE"
            color={Colors.Red}
            onClick={cbOnConfirm}
          />
        </>
      }
    />
  );
};

export default ModalMediasDelete;
