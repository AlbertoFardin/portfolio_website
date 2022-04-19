import * as React from "react";
import Btn from "../../Btn";

interface IBtnDelete {
  onCancel: () => void;
  onDelete: () => void;
}

const BtnDelete = ({ onCancel, onDelete }: IBtnDelete) => {
  const buttonStyle = { margin: "0 0 0 8px", minWidth: 0 };
  return (
    <>
      <Btn style={buttonStyle} onClick={onCancel} label="No" />
      <Btn style={buttonStyle} onClick={onDelete} label="Yes" />
    </>
  );
};

export default BtnDelete;
