import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { IProduct } from "../../../../interfaces";
import Btn from "../../../../componentsBase/Btn/Btn";
import { KEY_ENTITY_TYPE, colorTheme } from "../../../../constants";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ContextDispatchViewport } from "../../contexts";
import { ACT_VPORT } from "../../reducer";

const useStyles = makeStyles({
  message: {
    flex: 1,
    "align-items": "center",
    "justify-content": "center",
    display: "flex",
    "flex-direction": "column",
    padding: "0 50px",
  },
});

interface IBtnType {
  entityType: string;
  entityCount: number;
  onClick: (type: string) => void;
}
const BtnType = ({ entityType, entityCount, onClick }: IBtnType) => {
  const onKeepType = React.useCallback(() => {
    onClick(entityType);
  }, [entityType, onClick]);
  const label = `Edit ${entityCount} item${
    entityCount > 1 ? "s" : ""
  } of ${entityType.toLocaleUpperCase()}`;

  return (
    <Btn
      color={colorTheme}
      style={{ margin: 5, width: 240, maxWidth: 1000 }}
      variant="bold"
      label={label}
      onClick={onKeepType}
    />
  );
};

interface IMsgEntityTypes {
  assetDatas: IProduct[];
}
const MsgEntityTypes = ({ assetDatas }: IMsgEntityTypes) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const countMap = assetDatas.reduce((acc, item) => {
    const type = item[KEY_ENTITY_TYPE];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const label = Object.keys(countMap).reduce((acc, type, index, array) => {
    const isUltimo = index + 1 === array.length;
    const isPenultimo = index + 1 === array.length - 1;
    const count = countMap[type];
    const labelItems = count > 1 ? " items " : " item ";
    const labelEnding = isUltimo ? "." : isPenultimo ? " and " : ", ";
    const labelType = type.toLocaleUpperCase() + " level";
    acc = acc + String(count) + labelItems + "of " + labelType + labelEnding;
    return acc;
  }, "You have selected ");
  const onClick = React.useCallback(
    (type: string) => {
      const ids = assetDatas
        .filter((d) => d[KEY_ENTITY_TYPE] === type)
        .map((d) => d.id);

      dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT, ids });
    },
    [assetDatas, dispatchViewport]
  );

  return (
    <div className={classes.message}>
      <Typography variant="subtitle2" children="👇 IMPORTANT👇" />
      <Typography
        variant="body2"
        children="You can bulk edit only product of the same level."
      />
      <br />
      <Typography variant="body1" children={label} />
      <Typography
        variant="body1"
        children="Please choose item group you want to keep editing."
      />
      <br />
      {Object.keys(countMap).map((type: string) => (
        <BtnType
          key={type}
          entityType={type}
          entityCount={countMap[type]}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default MsgEntityTypes;
