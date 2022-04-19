import * as React from "react";
import Typography from "@material-ui/core/Typography";

interface ILabel {
  title: string;
  value: string;
}

const Label = ({ title, value }: ILabel) => {
  return (
    <div style={{ marginTop: 5 }}>
      <Typography variant={"caption"} children={title} />
      <Typography variant={"body2"} children={value} />
    </div>
  );
};

export default Label;
