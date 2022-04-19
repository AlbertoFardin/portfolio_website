import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Breadcrumb from "../../Breadcrumb";
import Typography from "@material-ui/core/Typography";
import { IFileDetail, IPath } from "../../../interfaces";
import { getFilesDetail } from "../../../api/fetchesApi";
import { useHistory } from "react-router-dom";
import { getUpdatedPath } from "../getUpdatedPath";
import concat from "lodash-es/concat";
import last from "lodash-es/last";
import { FOLDER_MYFILE, FOLDER_SHARED } from "../constants";
import { ACT_VPORT } from "../reducer";
import { ContextDispatchViewport } from "../contexts";
import { ContextCurrentUser } from "../../contexts";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(({ zIndex }) => ({
  assetPath: {
    position: "absolute",
    bottom: 10,
    left: 10,
    "z-index": zIndex.drawer,
    "background-color": Colors.Gray4,
    padding: "0 5px",
    "min-height": 40,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
}));

enum ACT_CMP {
  UPDATED = "UPDATED",
  LOADING = "LOADING",
}

interface IReducerState {
  assetData: IFileDetail;
  loading: boolean;
}

const reducerInitState: IReducerState = {
  assetData: null,
  loading: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_CMP.LOADING:
      newState.assetData = reducerInitState.assetData;
      newState.loading = true;
      return newState;
    case ACT_CMP.UPDATED:
      newState.assetData = action.assetData;
      newState.loading = false;
      return newState;
    default:
      return state;
  }
};

interface IAssetPath {
  open: boolean;
  assetDataId: string;
  path: IPath[];
}

const AssetPath = ({ open, assetDataId, path }: IAssetPath) => {
  const classes = useStyles({});

  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const userProfile = React.useContext(ContextCurrentUser);

  const userId = userProfile.id;

  const [stateCmp, dispatchCmp] = React.useReducer(reducer, reducerInitState);
  const { assetData, loading } = stateCmp;
  const history = useHistory();
  const onBreadcrumbClick = React.useCallback(
    (id: string) => {
      if (id === last(path).id) {
        dispatchViewport({ type: ACT_VPORT.FOLDER_NAVIGATE });
      } else {
        history.push(getUpdatedPath(id));
      }
    },
    [dispatchViewport, path, history]
  );

  // get file detail
  React.useEffect(() => {
    (async () => {
      if (assetDataId && open) {
        try {
          dispatchCmp({ type: ACT_CMP.LOADING });
          const [assetData] = await getFilesDetail([assetDataId]);
          dispatchCmp({ type: ACT_CMP.UPDATED, assetData });
        } catch {
          dispatchCmp({
            type: ACT_CMP.UPDATED,
            assetData: reducerInitState.assetData,
          });
        }
      }
    })();
  }, [assetDataId, open]);

  if (!assetDataId || !open) return null;

  return (
    <Paper className={classes.assetPath} elevation={5}>
      {loading || !assetData ? (
        <Typography variant="body2" children="..." />
      ) : (
        <Breadcrumb
          maxItems={6}
          path={concat(
            assetData.owner === userId ? FOLDER_MYFILE : FOLDER_SHARED,
            assetData.path || []
          )}
          onClick={onBreadcrumbClick}
        />
      )}
    </Paper>
  );
};

export default AssetPath;
