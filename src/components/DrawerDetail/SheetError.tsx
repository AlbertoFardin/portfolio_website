import Btn from "../../componentsBase/Btn";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import { colorTheme } from "../../constants";
import getUser from "../../utils/getUser";
import { ContextCurrentUser, ContextM2ms, ContextUsers } from "../contexts";

const useStyles = makeStyles({
  fallback: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    "justify-content": "center",
    flex: 1,
  },
  fallbackIcon: {
    height: 80,
    "font-size": "60px !important",
  },
  email: {
    color: colorTheme,
    "text-decoration": "none",
    "font-weight": "bold",
  },
});

interface ISheetError {
  error: string;
  onReset: () => void;
}

const SheetError = ({ onReset, error }: ISheetError) => {
  const classes = useStyles({});

  const userProfile = React.useContext(ContextCurrentUser);
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const userId = userProfile.id;
  const tenantId = userProfile.tenantId;

  const user = getUser(userId, { users, m2ms });
  const emailSubject = "subject=SeeCommerce - Report Error";
  const emailBody =
    `body=Hi, I want to report a problem in SeeCommerce:` +
    ` %0D ` +
    ` %0D * Tenant: ${tenantId}` +
    ` %0D * User: ${user.firstName} ${user.lastName}` +
    ` %0D * Component: Sheet` +
    ` %0D * Error message: ${error}`;

  return (
    <div className={classes.fallback}>
      <Icon className={classes.fallbackIcon} children="🤭" />
      <Typography variant="body1" children="An unexpected error occurred" />
      <Typography
        variant="body1"
        children="You can clear your selection and try again"
      />
      <br />
      <Btn
        color={colorTheme}
        variant="bold"
        label="DESELECT"
        onClick={onReset}
      />
      <br />
      <Typography
        variant="body1"
        children="If the error persists, please contact"
      />
      <Typography
        variant="body1"
        children={
          <>
            <span children="the service provider at " />
            <a
              target="_blank"
              rel="noreferrer"
              className={classes.email}
              href={`mailto:support@warda.it?${emailSubject}&${emailBody}`}
              children="support@warda.it"
            />
          </>
        }
      />
      <br />
      <Typography
        variant="body1"
        children="We apologize for the inconvenience"
      />
      <Typography variant="body1" children="WARDA Team" />
    </div>
  );
};

export default SheetError;
