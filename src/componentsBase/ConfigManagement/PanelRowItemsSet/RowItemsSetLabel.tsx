/* eslint-disable jsx-a11y/no-autofocus */
import Input from "@material-ui/core/Input";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TypographyEllipsis from "../../TypographyEllipsis";
import * as Colors from "../../style/Colors";
interface IStyles {
  label;
  inputValue;
  isLoading;
  isSelected;
}
const useStyles = makeStyles(({ typography, palette }) => {
  const colorMain = palette.primary.main;
  return {
    rowItemsetLabel: {
      flex: 1,
      display: "flex",
      "flex-direction": "row",
      "align-items": "center",
      width: 10, // fix row style overflowX
    },
    label: {
      color: ({ label, inputValue, isLoading, isSelected }: IStyles) =>
        label !== inputValue || isLoading || isSelected
          ? colorMain
          : Colors.Gray1,
    },
    input: {
      position: "absolute",
      outline: "none",
      "background-color": "#fff",
      "font-size": typography.body1.fontSize,
      "margin-top": -1,
      color: ({ label, inputValue }: IStyles) =>
        inputValue !== label ? colorMain : "#b2b2b2",
      "&::before": {
        display: "none",
      },
      "&::after": {
        display: "none",
      },
    },
  };
});

interface IRowItemsSetLabel {
  label: string;
  labelCount: number;
  isLoading: boolean;
  isSelected: boolean;
  onRename: (text: string) => void;
  onSelect: () => void;
}

interface ILabelPosition {
  x: number;
  y: number;
}

const defaultLabelPosition = { x: 0, y: 0 };

const RowItemsSetLabel = ({
  isLoading = false,
  isSelected = false,
  label = "",
  labelCount = 0,
  onRename,
  onSelect,
}: IRowItemsSetLabel) => {
  const [inputValue, setInputValue] = React.useState(label);
  const classes = useStyles({ label, inputValue, isLoading, isSelected });
  const clickRef = React.useRef(0);
  const divRef = React.useRef(null);
  const [labelPosition, setLabelPosition] = React.useState(
    defaultLabelPosition as ILabelPosition
  );

  const onClose = React.useCallback(() => {
    setLabelPosition(defaultLabelPosition);
    onRename(inputValue);
  }, [inputValue, onRename]);
  const onClick = React.useCallback(() => {
    const clickTimeNow = new Date().getTime();

    if (clickTimeNow - clickRef.current < 500) {
      setLabelPosition({
        x: divRef.current.getBoundingClientRect().left,
        y: divRef.current.getBoundingClientRect().top - 4,
      });
    }

    if (!isSelected) {
      onSelect();
    }

    clickRef.current = clickTimeNow;
  }, [isSelected, onSelect]);

  const onKeyPress = React.useCallback(
    (event) => {
      if (event.key === "Enter") onClose();
    },
    [onClose]
  );

  const onChange = React.useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  React.useEffect(() => {
    setInputValue(label);
  }, [setInputValue, label]);

  return (
    <div ref={divRef} className={classes.rowItemsetLabel}>
      {isLoading ? null : (
        <Typography
          variant="body2"
          className={classes.label}
          style={{ marginRight: 5 }}
          children={`(${labelCount})`}
        />
      )}
      <Modal
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
        onClose={onClose}
        open={!!(labelPosition.x && labelPosition.y)}
      >
        <Input
          className={classes.input}
          style={{
            left: labelPosition.x,
            top: labelPosition.y,
            width: divRef && divRef.current ? divRef.current.offsetWidth : 0,
          }}
          defaultValue={inputValue}
          onChange={onChange}
          onKeyPress={onKeyPress}
          autoFocus
        />
      </Modal>
      <TypographyEllipsis
        className={classes.label}
        variant={isSelected ? "body2" : "body1"}
        onClick={onClick}
        children={label}
      />
    </div>
  );
};

export default RowItemsSetLabel;
