import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Btn from "../../componentsBase/Btn";
import MenuUser from "./MenuUser";
import MenuSections from "./MenuSections";
import { reducer, reducerInitState, ACT_MAINBAR } from "./reducer";
import ModalLogout from "./ModalLogout";
import BtnConference from "./BtnConference";
import Nyan from "./Nyan";
import CatchCode from "../../componentsBase/CatchCode";
import BtnUpload from "../Uploads/BtnUpload";
import { ContextDispatchMain } from "../contexts";
import { ACTION_MAIN } from "../reducer";
import { ISection, ITenant, IUserProfile } from "../../interfaces";
import { useHistory } from "react-router-dom";
import { logOut } from "../../api/fetchCookieJwt";
import { APP_NAME } from "../../constants";
import { BtnWindowJobs } from "../WindowJobs";

const useStyles = makeStyles({
  main: {
    padding: 0,
    position: "relative",
    "background-color": Colors.Gray4,
  },
  maintoolbar: {
    position: "absolute",
    "background-color": "transparent",
    padding: "0 10px",
    flex: 1,
    right: 0,
    left: 0,
    margin: 0,
  },
  badge: {
    cursor: "pointer",
    position: "absolute",
    top: "-3px",
    left: 15,
    "background-color": "#f00",
    "border-radius": 50,
    border: `1px solid ${Colors.Gray4}`,
    padding: "0 5px",
  },
  flex1: {
    flex: 1,
  },
});

interface IMainToolbar {
  userProfile: IUserProfile;
  tenantId: string;
  tenants: ITenant[];
  sectionId: string;
  sections: ISection[];
  conferenceOpen: boolean;
  notificationsOpen: boolean;
  notificationsToView: number;
}

const MainToolbar = ({
  userProfile,
  tenantId,
  tenants,
  sectionId,
  sections,
  conferenceOpen,
  notificationsOpen,
  notificationsToView,
}: IMainToolbar) => {
  const history = useHistory();
  const dispatchMain = React.useContext(ContextDispatchMain);
  const classes = useStyles({});

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { menuUser, menuSections, modalLogout, nyan } = state;

  const onToggleMenuUser = React.useCallback(() => {
    dispatch({ type: ACT_MAINBAR.MENU_USER });
  }, []);
  const onToggleMenuSection = React.useCallback(() => {
    dispatch({ type: ACT_MAINBAR.MENU_SECTIONS });
  }, []);
  const onToggleModalLogout = React.useCallback(() => {
    dispatch({ type: ACT_MAINBAR.MODAL_LOGOUT });
  }, []);
  const onLogout = React.useCallback(() => {
    logOut(history);
  }, [history]);
  const onUserInfo = React.useCallback(() => {
    dispatch({ type: ACT_MAINBAR.RESET });
    dispatchMain({ type: ACTION_MAIN.INFO_USER });
  }, [dispatchMain]);
  const onClickConference = React.useCallback(() => {
    if (!conferenceOpen) dispatchMain({ type: ACTION_MAIN.CONFERENCE });
  }, [dispatchMain, conferenceOpen]);
  const onClickNotifications = React.useCallback(() => {
    dispatchMain({ type: ACTION_MAIN.NOTIFICATIONS_OPEN });
  }, [dispatchMain]);
  const onNyanCatch = React.useCallback(() => {
    dispatch({ type: ACT_MAINBAR.NYAN });
  }, []);

  const menuUserRef = React.useRef(null);
  const menuSectionsRef = React.useRef(null);
  const section = sections.find(({ id }) => id === sectionId);
  const sectionLabel = section ? section.label : APP_NAME;
  const listeners = React.useMemo(() => {
    return [{ toCatch: "↑↑↓↓←→←→ba", onCatch: onNyanCatch }];
  }, [onNyanCatch]);

  return (
    <>
      <Toolbar className={classes.main}>
        <CatchCode listeners={listeners}>
          <Nyan open={nyan} />
        </CatchCode>
        <Toolbar className={classes.maintoolbar}>
          <div ref={menuUserRef}>
            <Btn
              avatar={userProfile.picture}
              onClick={onToggleMenuUser}
              selected={menuUser}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Btn
              icon="notifications"
              tooltip="Notifications"
              selected={notificationsOpen}
              onClick={onClickNotifications}
            />

            {!notificationsToView ? null : (
              <div
                role="presentation"
                className={classes.badge}
                style={{ backgroundColor: Colors.Red }}
                onClick={onClickNotifications}
              >
                <Typography
                  style={{ color: "#fff" }}
                  variant="caption"
                  children={
                    notificationsToView > 9 ? "+9" : notificationsToView
                  }
                />
              </div>
            )}
          </div>
          <div ref={menuSectionsRef}>
            <Btn
              label={sectionLabel}
              labelPosition={"left"}
              icon="keyboard_arrow_down"
              onClick={onToggleMenuSection}
              selected={menuSections}
            />
          </div>
          <div className={classes.flex1} />
          <BtnWindowJobs />
          <BtnUpload />
          <BtnConference
            tooltip="Web Conference"
            selected={conferenceOpen}
            onClick={onClickConference}
          />
        </Toolbar>
      </Toolbar>
      <MenuSections
        anchorEl={menuSectionsRef.current}
        open={menuSections}
        onClose={onToggleMenuSection}
        tenantId={tenantId}
        tenants={tenants}
        sectionId={sectionId}
        sections={sections}
      />
      <MenuUser
        anchorEl={menuUserRef.current}
        open={menuUser}
        onClose={onToggleMenuUser}
        onLogout={onToggleModalLogout}
        onUserInfo={onUserInfo}
        userProfile={userProfile}
      />
      <ModalLogout
        open={modalLogout}
        btnLogoutOnClick={onLogout}
        btnCancelOnClick={onToggleModalLogout}
      />
    </>
  );
};

export default MainToolbar;
