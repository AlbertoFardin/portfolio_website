import Btn from "../../../../../../componentsBase/Btn";
import * as Colors from "../../../../../../componentsBase/style/Colors";
import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import { ICatalog, IReady } from "../../../../../../interfaces";
import IMediaCatalog from "./IMediaCatalog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import getCatalogLabel from "./getCatalogLabel";

interface IStyles {
  hover: boolean;
}
const useStyles = makeStyles({
  label: {
    transition: "max-width 1000ms",
    "max-width": ({ hover }: IStyles) => (hover ? 150 : 0),
  },
});

interface IButton {
  onChange: (toAdd: IMediaCatalog[], toRemove: IMediaCatalog[]) => void;
  onClick: (event: React.MouseEvent) => void;
  catalogsView: string[];
  catalogsTenant: ICatalog[];
  readys: IReady[];
  disabled: boolean;
  mediaIdSelected: string;
}
const Button = ({
  onChange,
  onClick,
  catalogsView,
  catalogsTenant,
  readys,
  disabled: disabledInit,
  mediaIdSelected,
}: IButton) => {
  const [hover, setHover] = React.useState(false);
  const onMouseEnter = React.useCallback(() => setHover(true), []);
  const onMouseLeave = React.useCallback(() => setHover(false), []);
  const classes = useStyles({ hover });
  const disabled = isEmpty(catalogsView) || disabledInit;
  const readyCount = readys.reduce((acc, cur: IReady) => {
    if (cur.contentId === mediaIdSelected) acc.push(cur);
    return acc;
  }, []).length;
  const catalogsAreAllReady = catalogsView.length <= readyCount;
  const cbOnClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (catalogsView.length === 1) {
        const [catalog] = catalogsView;
        const mediaCatalogs = [{ id: catalog, label: catalog, media: [] }];
        if (catalogsAreAllReady) {
          onChange([], mediaCatalogs);
        } else {
          onChange(mediaCatalogs, []);
        }
      } else {
        onClick(event);
      }
    },
    [catalogsView, catalogsAreAllReady, onChange, onClick]
  );

  let tooltip = "Set/Unset Ready";
  if (catalogsAreAllReady) tooltip = "Unset Ready";
  if (!readyCount) tooltip = "Set Ready";
  if (!catalogsView.length) tooltip = "No catalogs to publish";

  return (
    <Btn
      color={Colors.Cyan}
      tooltip={tooltip}
      disabled={disabled}
      icon={"public"}
      label={getCatalogLabel({
        hover,
        catalogsView,
        catalogsTenant,
      })}
      labelPosition={"left"}
      labelClassName={classes.label}
      onClick={cbOnClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default Button;
