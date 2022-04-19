import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IAdminUserProfile } from "../../../interfaces";
import ActionsbarLibray from "../../../componentsBase/ActionsBar";
import Btn from "../../../componentsBase/Btn";
import hasRequired from "./hasRequired";
import { ACT_VPORT } from "../reducer";
import { ContextDispatchViewport } from "../contexts";

const useStyles = makeStyles({
  actionbar: {
    "border-top": "1px solid #e5e5e5",
    "background-color": Colors.Gray4,
    padding: "0 15px",
  },
  flex1: {
    flex: 1,
  },
});

interface IActionbar {
  user: IAdminUserProfile;
  inEdit: boolean;
}

const Actionbar = ({ user, inEdit }: IActionbar) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onCreate = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.USER_CREATING });
  }, [dispatchViewport]);

  return (
    <ActionsbarLibray open={inEdit} className={classes.actionbar}>
      <div className={classes.flex1} />
      <Btn
        disabled={!hasRequired(user)}
        variant="bold"
        color={Colors.Green}
        label="CREATE"
        onClick={onCreate}
      />
      <div className={classes.flex1} />
    </ActionsbarLibray>
  );
};

export default Actionbar;
