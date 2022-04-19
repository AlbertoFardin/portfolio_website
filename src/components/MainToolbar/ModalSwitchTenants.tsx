import * as React from "react";
import { List, Popover } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItem from "../../componentsBase/ListItem";
import { ITenant } from "../../interfaces";
import { ContextDispatchMain } from "../contexts";
import { ACTION_MAIN } from "../reducer";

const useStyles = makeStyles(({ palette }) => ({
  menu: {
    "min-width": 220,
  },
  listitem: {
    padding: "5px 20px",
  },
  listitemSelected: {
    color: palette.primary.main,
  },
}));

interface IModalSwitchTenants {
  anchorEl: Element | ((element: Element) => Element);
  open: boolean;
  onClose: () => void;
  tenants?: ITenant[];
}

const ModalSwitchTenants = ({
  anchorEl,
  open,
  onClose,
  tenants,
}: IModalSwitchTenants) => {
  const dispatchMain = React.useContext(ContextDispatchMain);
  const classes = useStyles({});
  const onClick = React.useCallback(
    (event, id: string) => {
      dispatchMain({ type: ACTION_MAIN.SWITCH_TENANT, id });
    },
    [dispatchMain]
  );

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
      PaperProps={{ className: classes.menu }}
    >
      <List>
        {tenants.map(({ id, label, active }) => (
          <ListItem
            key={id}
            id={id}
            label={label}
            className={classes.listitem}
            active={active}
            onClick={onClick}
          />
        ))}
      </List>
    </Popover>
  );
};

export default ModalSwitchTenants;
