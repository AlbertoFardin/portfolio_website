import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { IBtn } from "../../../../../componentsBase/Btn";
import { ViewType } from "../../../../../interfaces";
import BtnChangeView from "../Buttons/BtnChangeView";
import ListFields from "../ListFields";
import { colorTheme, FIELD_WIDTH } from "../../../../../constants";
import { ContextM2ms, ContextUsers } from "../../../../contexts";
import ILayout from "../ILayout";
import PreviewContainer from "./PreviewContainer";
import getViewDetail from "../../../getViewDetail";
import BtnBadge from "../../../../../componentsBase/BtnBadge";
import getBadgeViewAssignee from "../../../getBadgeViewAssignee";
import getBadgeViewCatalogs from "../../../getBadgeViewCatalogs";
import concat from "lodash-es/concat";
import ToolbarActionsLeft from "../ToolbarActions/ToolbarActionsLeft";
import ToolbarActionsRight from "../ToolbarActions/ToolbarActionsRight";
import getSearchString, { NO_VALUE } from "../../../getSearchString";
import { useHistory, useLocation } from "react-router-dom";
import { ContextCatalogs, ContextDispatchViewport } from "../../../contexts";

const Flex1 = () => <div style={{ flex: 1 }} />;
const useStyles = makeStyles({
  layoutDefault: {
    flex: 1,
    position: "relative",
    "overflow-x": "hidden",
    "overflow-y": "overlay",
    margin: "0 10px",
    "padding-bottom": 50,
  },
  toolbar: {
    padding: "0 10px",
  },
  toolbarMedia: {
    padding: "0 5px 0 0",
  },
  field: {
    margin: "15px 10px",
    "vertical-align": "top",
  },
});

const LayoutDefault = (p: ILayout) => {
  const {
    assetData,
    histories,
    historySelected,
    historyIndex,
    mediaData,
    mediaSelected,
    imageId,
    setImageId,
    setFullscreen,
  } = p;
  const classes = useStyles({});

  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const catalogs = React.useContext(ContextCatalogs);
  const m2ms = React.useContext(ContextM2ms);
  const users = React.useContext(ContextUsers);

  const viewDetail = getViewDetail(assetData, mediaSelected.view);
  const isMediaExist = !!mediaSelected.filename;
  const badges = React.useMemo(() => {
    return concat(
      getBadgeViewAssignee({
        dispatch: dispatchViewport,
        item: assetData,
        viewDetail,
        users,
        m2ms,
        style: { position: "relative", marginLeft: "-5px" },
      }),
      getBadgeViewCatalogs({
        dispatch: dispatchViewport,
        item: assetData,
        tenantCatalogs: catalogs,
        viewDetail,
        style: { position: "relative", marginLeft: 5 },
      })
    ).filter((a) => !!a);
  }, [assetData, dispatchViewport, m2ms, catalogs, users, viewDetail]);
  const history = useHistory();
  const queryString = useLocation().search;

  React.useEffect(() => {
    // fix url with what I'm seeing
    if (imageId === NO_VALUE) {
      history.push(
        getSearchString({ detailImgId: mediaSelected.fileId }, queryString)
      );
    }
  }, [history, imageId, mediaSelected.fileId, queryString]);

  return (
    <div className={classes.layoutDefault}>
      <Toolbar className={classes.toolbarMedia}>
        <BtnChangeView
          histories={histories}
          historyIndex={historyIndex}
          viewDetail={viewDetail}
          assetData={assetData}
          onChange={setImageId}
        />
        <Flex1 />
        {badges.map((p: IBtn, i: number) => (
          <BtnBadge key={i} {...p} />
        ))}
      </Toolbar>

      <PreviewContainer
        colorTheme={colorTheme}
        assetData={assetData}
        setImageId={setImageId}
        setFullscreen={setFullscreen}
        imagesHistory={historySelected}
        image={mediaSelected}
        imageRequired={viewDetail.viewType === ViewType.MANDATORY}
      />

      <Toolbar className={classes.toolbarMedia}>
        <ToolbarActionsLeft {...p} />
        <Flex1 />
        <ToolbarActionsRight {...p} />
      </Toolbar>
      {!isMediaExist ? null : (
        <>
          <Toolbar className={classes.toolbar}>
            <Typography variant="subtitle2" children="Media Info" />
          </Toolbar>
          <ListFields
            assetData={assetData}
            mediaData={mediaData}
            media={mediaSelected}
            users={users}
            m2ms={m2ms}
            fieldStyle={{ width: FIELD_WIDTH / 2 }}
            fieldClassName={classes.field}
          />
        </>
      )}
    </div>
  );
};

export default LayoutDefault;
