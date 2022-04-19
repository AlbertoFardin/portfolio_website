import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Btn from "../../../componentsBase/Btn";
import Breadcrumb from "../../Breadcrumb";
import { ACT_VPORT } from "../reducer";
import BtnAction from "./BtnAction";
import {
  IAction,
  MAP_TYPE,
  MAP_UPLOAD_DIRECTORY,
  getItemActions,
  getContentActions,
} from "../actions";
import isEmpty from "lodash-es/isEmpty";
import last from "lodash-es/last";
import FiltersChips from "../../FiltersChips";
import InputDA from "../../Uploads/BtnUpload/InputDA";
import { IFilter, IFile, IPath, SheetLayout } from "../../../interfaces";
import { useHistory } from "react-router-dom";
import { getUpdatedPath } from "../getUpdatedPath";
import { ContextDispatchViewport } from "../contexts";
import { ContextPermissions } from "../../contexts";
import Divider from "@material-ui/core/Divider";
import AssetPath from "./AssetPath";
import BtnRefresh from "./BtnRefresh";
import Pagination from "./Pagination";

const useStyles = makeStyles({
  toolbar: {
    position: "relative",
    padding: "0 10px",
  },
  flex1: {
    flex: 1,
  },
  separator: {
    "border-right": `1px solid ${Colors.Gray2}`,
    height: 23,
    "margin-right": 12,
    "margin-left": 5,
  },
  divider: {
    margin: "0 10px",
  },
});

interface IToolbarHeader {
  filters: IFilter[];
  path: IPath[];
  detailSheet: SheetLayout;
  items: IFile[];
  itemsIdSelected: string[];
  itemsTotal: number;
  cuttedFile: IFile[];
  cuttedPath: string;
  filtered: boolean;
  paginationSize: number;
  paginationValue: number;
  assetDataId: string;
}

const ToolbarHeader = ({
  items,
  itemsIdSelected,
  itemsTotal,
  cuttedFile,
  cuttedPath,
  path,
  filters,
  detailSheet,
  filtered,
  paginationSize,
  paginationValue,
  assetDataId,
}: IToolbarHeader) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const permissions = React.useContext(ContextPermissions);
  const classes = useStyles({});
  const history = useHistory();
  const count = itemsIdSelected.length;
  const onBreadcrumbClick = React.useCallback(
    (id: string) => {
      if (id === last(path).id) {
        dispatchViewport({ type: ACT_VPORT.REFRESH });
      } else {
        history.push(getUpdatedPath(id));
      }
    },
    [dispatchViewport, history, path]
  );
  const onActionClick = React.useCallback(
    (event, id) => {
      const type = MAP_TYPE[id];
      if (type) dispatchViewport({ type });
    },
    [dispatchViewport]
  );
  const onFiltersChange = React.useCallback(
    (payload) => {
      dispatchViewport({ type: ACT_VPORT.FILTERS_SET, payload });
    },
    [dispatchViewport]
  );
  const getActionChildren = React.useCallback(
    ({ id, onClose }) => {
      if (!Object.keys(MAP_UPLOAD_DIRECTORY).find((f) => f === id)) return null;
      return (
        <InputDA
          folderId={last(path).id}
          onClose={onClose}
          directory={MAP_UPLOAD_DIRECTORY[id]}
        />
      );
    },
    [path]
  );
  const itemActions: IAction[] = React.useMemo(() => {
    // è sufficiente che un item tra quelli selezionati sia
    // disabilitato per togliere tutte le azioni
    const hideActions = (() => {
      const itemsSelected = items.filter((i) =>
        new Set(itemsIdSelected).has(i.id)
      );

      let result = false;
      for (const i of itemsSelected) {
        if (!result && !!i?.publicshares?.find((p) => !p.availability)) {
          result = true;
        }
      }

      return result;
    })();
    return !hideActions
      ? getItemActions({
          permissions,
          contextmenu: false,
          detailSheet,
          path,
          items,
          itemsIdSelected,
          onClick: onActionClick,
        })
      : [];
  }, [detailSheet, items, itemsIdSelected, onActionClick, path, permissions]);
  const contentActions: IAction[] = React.useMemo(() => {
    return getContentActions({
      cuttedFile,
      cuttedPath,
      path,
      onClick: onActionClick,
      getAdditionalChildren: getActionChildren,
    });
  }, [cuttedFile, cuttedPath, getActionChildren, onActionClick, path]);

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <div className={classes.flex1} />
        {isEmpty(itemsIdSelected) ? null : (
          <>
            <Btn
              icon="remove_red_eye"
              label={String(count)}
              disabled
              tooltip={`${count} item${count > 1 ? "s" : ""} selected`}
            />
            {itemActions.map((a) => (
              <BtnAction key={a.id} {...a} />
            ))}
            {isEmpty(itemActions) ? null : (
              <div className={classes.separator} />
            )}
          </>
        )}
        <Btn
          disabled={isEmpty(contentActions)}
          icon="add"
          menu={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            items: contentActions,
          }}
        />
      </Toolbar>
      <Toolbar className={classes.toolbar}>
        <FiltersChips filters={filters} onChange={onFiltersChange} />
        {filtered || isEmpty(path) ? null : (
          <Breadcrumb path={path} onClick={onBreadcrumbClick} />
        )}

        <div className={classes.flex1} />
        <BtnRefresh />
        <Pagination
          paginationSize={paginationSize}
          paginationValue={paginationValue}
          itemsTotal={itemsTotal}
        />
      </Toolbar>
      <Divider className={classes.divider} />
      <AssetPath
        open={itemsIdSelected.length === 1 && filtered}
        assetDataId={assetDataId}
        path={path}
      />
    </>
  );
};

export default ToolbarHeader;
