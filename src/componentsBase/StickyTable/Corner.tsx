import * as React from "react";
import useStyles from "./useStyles";
import classnames from "classnames";

interface ICorner {
  outerWidth?: boolean;
  className?: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

// These corners have z-index: 2 and sit above the headers. To get properly synchronized positioning, they also need
// "position: sticky". However, if they have a width or height, they'll offset the headers, kind of defeating the
// purpose. We can get around this by actually giving them a height/width of 0, giving them "overflow: visible", and
// sizing the sub-divs. The exception is some hackery for the right-side corners: they need to actually have a width to
// appear properly, so we take a flag to determine if the outer div should have the same width.
const CornerMemo = ({
  outerWidth = false,
  className = "",
  width,
  height,
  top,
  left,
}: ICorner) => {
  const cls = useStyles({});
  return (
    <div
      className={cls.corner}
      style={{ top, left, width: outerWidth ? width : 0 }}
    >
      <div
        className={classnames([cls.cornerInner, className])}
        style={{ width, height }}
      />
    </div>
  );
};

const Corner = React.memo(CornerMemo);

export default Corner;
