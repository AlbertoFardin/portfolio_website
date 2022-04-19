import * as React from "react";
import { ILabelPositionX, ILabelPositionY } from "../Label";
import MuIcon from "@material-ui/core/Icon";
import MuPaper from "@material-ui/core/Paper";
import { urlImage2 } from "../../__stories__/mediaUrls";
import Btn from "../../Btn";

export const style = {
  width: 300,
  maxHeight: 300,
  margin: "35px 25px",
};

export const adornmentIcon = "alarm";
export const adornmentAvatar = urlImage2;

const adornmentElementOnClick = () => console.log("onClick adornmentElement");
export const adornmentElement = (
  <Btn
    color="#f00"
    selected
    icon="close"
    label="adornmentElement"
    onClick={adornmentElementOnClick}
    style={{ margin: 0, minHeight: 32, maxWidth: "inherit", zIndex: 999 }}
  />
);

export const Paper = (p) => (
  <MuPaper
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: 10,
      margin: "0 25px",
    }}
    elevation={5}
    {...p}
  />
);
export const BtnEdit = ({ label, onClick }) => (
  <Btn label={label} icon="edit" onClick={onClick} />
);
export const BtnCheck = ({ label, check, onClick }) => (
  <Btn
    label={label}
    icon={check ? "check_box" : "check_box_outline_blank"}
    onClick={onClick}
  />
);

export const label = [
  {
    required: true,
    id: "label_1",
    label: "label_1",
    positionX: ILabelPositionX.left,
    positionY: ILabelPositionY.top,
    style: { color: "#fff", backgroundColor: "#00f", padding: "0 5px" },
  },
  {
    id: "label_2",
    label: "label_2",
    positionX: ILabelPositionX.right,
    positionY: ILabelPositionY.top,
    style: { color: "#fff", backgroundColor: "#f00", padding: "0 5px" },
  },
  {
    id: "label_3",
    label: "label_3",
    positionX: ILabelPositionX.right,
    positionY: ILabelPositionY.bottom,
    style: { color: "#fff", backgroundColor: "#0f0", padding: "0 5px" },
  },
  {
    id: "label_4",
    label: (
      <>
        <MuIcon
          style={{ fontSize: 14, verticalAlign: "middle" }}
          children="public"
        />
        <span
          style={{ fontSize: 12, verticalAlign: "middle" }}
          children="READY"
        />
      </>
    ),
    positionX: ILabelPositionX.left,
    positionY: ILabelPositionY.bottom,
    style: { color: "#00f" },
  },
];

export const menuItems = [
  {
    id: "1",
    label: "listitem_1",
    onClick: () => console.log("__click1"),
  },
  {
    id: "2",
    label: "listitem_2",
    onClick: () => console.log("__click2"),
  },
  {
    id: "3",
    label: "listitem_3",
    onClick: () => console.log("__click3"),
  },
];
