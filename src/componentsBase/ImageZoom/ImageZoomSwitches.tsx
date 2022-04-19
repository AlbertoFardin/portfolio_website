/* eslint-disable */
import Paper from "@material-ui/core/Paper";
import classnames from "classnames";
import * as React from "react";
import cls from "../style";
import * as Colors from "../style/Colors";

export interface ImageZoomSwitchesProps {
  className?: string;
  color: string;
  index: number;
  length: number;
  onClick: (...key: any) => any;
  style?: React.CSSProperties;
}

class ImageZoomSwitches extends React.Component<ImageZoomSwitchesProps> {
  public static defaultProps = {
    color: Colors.Blue,
    index: 0,
    length: 0,
    onClick: () => null,
  };

  public getSwitches = () => {
    const { length, index, color, onClick } = this.props;
    const switches = [];
    for (let i = 0; i < length; i++) {
      switches.push(
        <Paper
          key={i}
          style={{
            backgroundColor: color,
          }}
          className={classnames({
            [cls.ScaleBig]: index === i,
            [cls.ScaleMedium]: index - 1 === i || index + 1 === i,
            [cls.ScaleSmall]: index - 2 === i || index + 2 === i,
          })}
          elevation={2}
          onClick={() => onClick(i)}
        />
      );
    }
    return switches;
  };

  public render() {
    const { className, style } = this.props;
    const switches = this.getSwitches();
    return (
      <div
        className={classnames({
          [cls.ImageZoomSwitches]: true,
          [className]: !!className,
        })}
        style={style}
        children={switches}
      />
    );
  }
}

export default ImageZoomSwitches;
