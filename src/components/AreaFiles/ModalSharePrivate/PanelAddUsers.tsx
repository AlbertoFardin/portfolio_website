import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../componentsBase/Field/FieldSelect";
import { ContextCurrentUser, ContextUsers } from "../../contexts";
import {
  IFileDetail,
  IUserProfile,
  IShared,
  SharedRole,
} from "../../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn from "../../../componentsBase/Btn";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as Colors from "../../../componentsBase/style/Colors";
import { getMenuLabel, getMenuIcon, getCreateLabel } from "./getMenuPrivate";
import Collapse from "@material-ui/core/Collapse";

const up = (t: string) => (t || "").toLocaleUpperCase();
const useStyles = makeStyles({
  flex1: {
    flex: 1,
  },
  toolbarDiv: {
    display: "flex",
    position: "relative",
    width: 420,
    "align-items": "flex-end",
  },
  toolbar: {
    padding: 0,
  },
  field: {
    flex: 1,
    margin: 0,
  },
  fieldInputAdornment: {
    margin: "0 16px 0 6px",
  },
});

enum ACTION {
  SEARCH_START = "SEARCH_START",
  SEARCH_STOP = "SEARCH_STOP",
  SET_OPTIONS = "SET_OPTIONS",
  SET_VALUE = "SET_VALUE",
  SET_SHARED_ROLE = "SET_SHARED_ROLE",
}

interface IReducerState {
  value: IFieldSelectItem[];
  options: IFieldSelectItem[];
  searchValue: string;
  searching: boolean;
  sharedRole: SharedRole;
}

const reducerInitState: IReducerState = {
  value: [],
  options: [],
  searchValue: "",
  searching: false,
  sharedRole: SharedRole.EDITOR,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.SEARCH_START:
      newState.searchValue = action.value;
      newState.searching = true;
      return newState;
    case ACTION.SEARCH_STOP:
      newState.searching = false;
      return newState;
    case ACTION.SET_OPTIONS:
      newState.searching = false;
      newState.options = action.users.map((u: IUserProfile) => {
        const { id, firstName, lastName, picture } = u;
        const selected = !!newState.value.find((v) => v.id === id);
        return {
          id,
          selected,
          label: `${firstName} ${lastName}`,
          avatar: picture,
        };
      });
      return newState;
    case ACTION.SET_VALUE:
      newState.value = action.value;
      return newState;
    case ACTION.SET_SHARED_ROLE:
      newState.sharedRole = action.value;
      return newState;
    default:
      return state;
  }
};

interface IPanelAddUsers {
  assetDatas: IFileDetail[];
  sharesToEdited: IShared[];
  onChange: (shares: IShared[]) => void;
  onCancel: () => void;
  onSave: () => void;
  onNotify: () => void;
  notify: boolean;
}

const PanelAddUsers = ({
  assetDatas,
  sharesToEdited,
  onChange,
  onCancel,
  onSave,
  onNotify,
  notify,
}: IPanelAddUsers) => {
  const classes = useStyles({});
  const userProfile = React.useContext(ContextCurrentUser);
  const userId = userProfile.id;
  const users = React.useContext(ContextUsers);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { value, options, searchValue, searching, sharedRole } = state;

  const canEdit = !assetDatas.find(({ canEdit }) => !canEdit);
  const readOnly = !!sharesToEdited.length;
  const idsShared = React.useMemo(() => {
    return new Set(
      assetDatas.reduce((acc, { owner, sharedWith }) => {
        acc.push(owner);
        sharedWith.forEach(({ id }) => acc.push(id));
        return acc;
      }, [])
    );
  }, [assetDatas]);
  const onSearch = React.useCallback((text: string) => {
    dispatch({ type: ACTION.SEARCH_START, value: text });
  }, []);
  const onChangeValue = React.useCallback(
    (item: IFieldSelectItem, array: IFieldSelectItem[]) => {
      dispatch({ type: ACTION.SET_VALUE, value: array });
      onChange(array.map(({ id }) => ({ id, role: sharedRole })));
    },
    [onChange, sharedRole]
  );
  const onChangeType = React.useCallback(
    (event, id) => {
      const role = Number(id);
      dispatch({ type: ACTION.SET_SHARED_ROLE, value: role });
      onChange(value.map(({ id }) => ({ id, role })));
    },
    [onChange, value]
  );

  React.useEffect(() => {
    try {
      if (searching) {
        const usersMatched: IUserProfile[] = users.reduce((acc, user) => {
          const { id, firstName, lastName } = user;
          const searchInputUp = up(searchValue);
          const matched =
            up(firstName).includes(searchInputUp) ||
            up(lastName).includes(searchInputUp);
          if (id !== userId && !idsShared.has(id) && matched) acc.push(user);
          return acc;
        }, []);
        dispatch({ type: ACTION.SET_OPTIONS, users: usersMatched });
      }
    } catch (err) {
      console.log("⚠️ SearchUser error: ", err);
      dispatch({ type: ACTION.SEARCH_STOP });
    }
  }, [searchValue, searching, users, userId, idsShared]);

  return (
    <>
      <Collapse in={canEdit}>
        <div className={classes.toolbarDiv}>
          <FieldSelect
            readOnly={readOnly}
            className={classes.field}
            loading={searching}
            placeholder={
              readOnly
                ? "Save changes to add other users to share"
                : "Search and add users to the share"
            }
            searchable
            onChange={onChangeValue}
            onSearch={onSearch}
            options={options}
            value={value}
            adornmentIcon="search"
          />
          {!value.length ? null : (
            <Btn
              color={Colors.Blue}
              variant="bold"
              style={{ marginLeft: 10, marginBottom: 5 }}
              label={getMenuLabel(sharedRole)}
              menu={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "right",
                },
                items: [SharedRole.EDITOR, SharedRole.VIEWER].map(
                  (s: SharedRole) => ({
                    id: String(s),
                    label: getCreateLabel(s, assetDatas.length),
                    icon: getMenuIcon(s),
                    active: sharedRole === s,
                    onClick: onChangeType,
                  })
                ),
              }}
            />
          )}
        </div>
      </Collapse>
      <Collapse in={!!value.length}>
        <>
          <Toolbar className={classes.toolbar}>
            <Btn
              color={Colors.Blue}
              icon={notify ? "check_box" : "check_box_outline_blank"}
              onClick={onNotify}
            />
            <Typography
              variant="body1"
              children={`${
                value.length > 1 ? "Users" : "User"
              } will be notified of the sharing`}
            />
          </Toolbar>
          <Toolbar className={classes.toolbar}>
            <div className={classes.flex1} />
            <Btn variant="bold" label="CANCEL" onClick={onCancel} />
            <Btn
              color={Colors.Green}
              variant="bold"
              label="SHARE"
              onClick={onSave}
            />
          </Toolbar>
        </>
      </Collapse>
    </>
  );
};

export default PanelAddUsers;
