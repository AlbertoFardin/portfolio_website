import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import LogoWarda from "../../componentsBase/LogoWarda";
import ListItem from "../../componentsBase/ListItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { NavLink } from "react-router-dom";
import Btn from "../../componentsBase/Btn";
import ModalSwitchTenants from "./ModalSwitchTenants";
import version from "../../../version.json";
import { APP_NAME } from "../../constants";
import { ISection, ITenant } from "../../interfaces";

const useStyles = makeStyles(({ palette }) => ({
  menusections: {
    "min-width": 220,
  },
  content: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  listitem: {
    padding: "5px 20px",
  },
  listitemDivider: {
    margin: "10px 20px 0",
  },
  header: {
    padding: "10px 5px 10px 20px",
    display: "flex",
    "flex-direction": "column",
  },
  tenant: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    fontWeight: 500,
  },
  footer: {
    padding: "10px 20px 15px",
    display: "flex",
    "flex-direction": "column",
  },
  title: {
    "font-size": 18,
    color: palette.primary.main,
  },
}));

interface IMenuSections {
  anchorEl: Element | ((element: Element) => Element);
  open: boolean;
  onClose: () => void;
  tenantId: string;
  tenants: ITenant[];
  sectionId: string;
  sections: ISection[];
}

const MenuSections = ({
  anchorEl,
  open,
  onClose,
  tenantId,
  tenants,
  sectionId,
  sections,
}: IMenuSections) => {
  const classes = useStyles({});
  const refButton = React.useRef(null);
  const [showModalSwitchTenant, setModalSwitchTenant] = React.useState(false);

  const onModalTenantOpen = React.useCallback(() => {
    setModalSwitchTenant(true);
  }, []);
  const onModalTenantClose = React.useCallback(() => {
    setModalSwitchTenant(false);
    onClose();
  }, [onClose]);

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{ className: classes.menusections }}
      >
        <div className={classes.content}>
          <div className={classes.header}>
            <Typography
              variant="subtitle2"
              children={APP_NAME}
              className={classes.title}
            />
            <Typography variant="caption" children={version.version} />
            <div className={classes.tenant} ref={refButton}>
              <Typography variant="body2" children={tenantId} />
              <div style={{ flex: 1 }} />
              {!tenants.length ? null : (
                <Btn label="SWITCH TO" onClick={onModalTenantOpen} />
              )}
            </div>
          </div>
          <Divider />
          <List>
            {sections
              .filter((s) => {
                return !s.hidden;
              })
              .map(({ id, icon, label, disabled, divider }) => {
                const active = id === sectionId;

                if (divider) {
                  return (
                    <div key={id} className={classes.listitemDivider}>
                      <Typography variant={"caption"} children={label} />
                      <Divider />
                    </div>
                  );
                }

                const node = (
                  <ListItem
                    key={id}
                    id={id}
                    label={label}
                    icon={icon}
                    className={classes.listitem}
                    active={active}
                    disabled={disabled}
                    onClick={onClose}
                    onClickStopPropagation={false}
                  />
                );

                return disabled ? (
                  node
                ) : (
                  <NavLink
                    key={id}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    to={`/${id}/`}
                    children={node}
                  />
                );
              })}
          </List>
          <Divider />
          <div className={classes.footer}>
            <LogoWarda color={Colors.Blue} width={60} height={25} />
            <Typography
              variant="caption"
              children="Copyright WARDA SRL - All rights reserved"
            />
            <a
              // eslint-disable-next-line react/jsx-no-target-blank
              target="_blank"
              rel="noreferrer"
              href={`http://www.warda.it`}
              style={{ color: Colors.Blue }}
            >
              <Typography variant={"caption"} children={"www.warda.it"} />
            </a>
          </div>
        </div>
        <ModalSwitchTenants
          anchorEl={refButton.current}
          open={showModalSwitchTenant}
          onClose={onModalTenantClose}
          tenants={tenants}
        />
      </Popover>
    </>
  );
};

export default MenuSections;
