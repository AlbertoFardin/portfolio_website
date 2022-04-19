import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import Btn from "../../componentsBase/Btn";
import * as Colors from "../../componentsBase/style/Colors";
import { IPath } from "../../interfaces";

const Separator = () => (
  <Icon style={{ color: Colors.Gray2 }} children="chevron_right" />
);
const Ellipsis = () => (
  <Typography
    key="ellipsis"
    style={{ color: Colors.Gray2, userSelect: "none" }}
    noWrap
    variant="subtitle1"
    children="..."
  />
);

interface IDirectory extends IPath {
  onClick: (id: string) => void;
}
const Directory = ({ id, name, onClick }: IDirectory) => {
  const cbOnClick = React.useCallback(() => {
    onClick(id);
  }, [id, onClick]);
  return <Btn label={name} style={{ margin: 2 }} onClick={cbOnClick} />;
};

interface IBreadcrumb {
  maxItems?: number;
  path: IPath[];
  onClick: (id: string) => void;
}
const Breadcrumb = ({ maxItems = 3, path, onClick }: IBreadcrumb) => (
  <div
    style={{
      display: "flex",
      flex: 1,
      alignItems: "center",
    }}
  >
    {path.reduce(
      (acc, p, index) => {
        const fromVisibleIndex = path.length - maxItems + 1;
        if (index >= fromVisibleIndex && index >= 1) {
          acc.push(<Separator key={"s_" + index} />);
          acc.push(<Directory key={"d_" + index} {...p} onClick={onClick} />);
        }
        return acc;
      },
      [
        <Directory key="d_" {...path[0]} onClick={onClick} />,
        path.length > maxItems && <Separator key="s_" />,
        path.length > maxItems && <Ellipsis key="e_" />,
      ]
    )}
  </div>
);

export default Breadcrumb;
