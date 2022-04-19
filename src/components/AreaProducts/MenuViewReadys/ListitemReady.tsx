import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import TypographyEllipsis from "../../../componentsBase/TypographyEllipsis";
import Btn from "../../../componentsBase/Btn";
import isEmpty from "lodash-es/isEmpty";
import { colorTheme } from "../../../constants";
import { IReady } from "../../../interfaces";
import sortByKey from "../../../utils/sortByKey";
import getUser from "../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../contexts";
import styles from "./styles";
import formatHoursMinutes from "../../../utils/formatHoursMinutes";

const useStyles = makeStyles(styles);

interface IListitemReady {
  index: number;
  label: string;
  instant: number;
  publications: IReady[];
  collapsed: boolean;
  onCollapse: (index: number) => void;
}

const ListitemReady = ({
  index,
  label,
  instant,
  publications,
  collapsed,
  onCollapse,
}: IListitemReady) => {
  const classes = useStyles({});

  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const onClick = React.useCallback(() => {
    onCollapse(index);
  }, [index, onCollapse]);

  return (
    <>
      <ListItem className={classes.listItem}>
        <Btn
          color={colorTheme}
          icon={collapsed ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          style={{
            borderWidth: 0,
            opacity: isEmpty(publications) ? 0 : 1,
            cursor: isEmpty(publications) ? "default" : "pointer",
          }}
          onClick={onClick}
        />
        <TypographyEllipsis
          className={classes.typogaphy}
          variant="body1"
          children={label}
        />
        <div className={classes.flex1} />
        <Typography
          className={classes.typogaphy}
          style={{ color: Colors.Cyan }}
          variant="body2"
          children="Ready"
        />
        <Typography
          className={classes.typogaphy}
          variant="body1"
          children={formatHoursMinutes(instant)}
        />
      </ListItem>
      <Collapse in={collapsed}>
        {sortByKey(publications, "user").map((cPublic: IReady) => (
          <ListItem key={cPublic.user} className={classes.listItem}>
            <Btn icon="placeholder" color="#000" style={{ opacity: 0 }} />
            <TypographyEllipsis
              className={classes.typogaphy}
              style={{ color: colorTheme }}
              variant="body1"
              children={getUser(cPublic.user, { users, m2ms }).name}
            />
            <div className={classes.flex1} />
            <Typography
              className={classes.typogaphy}
              style={{ color: colorTheme }}
              variant="body1"
              children={formatHoursMinutes(cPublic.instant)}
            />
          </ListItem>
        ))}
      </Collapse>
    </>
  );
};

export default ListitemReady;
