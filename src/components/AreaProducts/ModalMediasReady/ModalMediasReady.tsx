import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import { ContentType, IProduct, Severity } from "../../../interfaces";
import { KEY_MEDIA, KEY_VIEW_DATA } from "../../../constants";
import { multiReady } from "../../../api/fetchesApi";
import getReadySets from "./utils/getReadySets";
import reducer, { reducerInitState, ACTION } from "./reducer";
import IMultiReadyCatalog from "./IMultiReadyCatalog";
import ListDivider from "./ListDivider";
import Footer from "./Footer";
import SelectCatalogs from "./SelectCatalogs";
import SelectViews from "./SelectViews";
import Btn from "../../../componentsBase/Btn";
import * as Colors from "../../../componentsBase/style/Colors";
import { ContextSetSnackbar } from "../../contexts";
import Modal from "../../Modal";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { ContextCatalogs } from "../contexts";

const useStyles = makeStyles(() => ({
  flex1: {
    flex: 1,
  },
  dialogHeader: {
    padding: "10px 0 0",
    height: 90,
    display: "flex",
    "flex-direction": "column",
    "align-items": "self-start",
  },
  dialogContent: {
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
  },
}));

interface IModalMediasReady {
  open?: boolean;
  loading?: boolean;
  onClose: () => void;
  items: IProduct[];
}

const ModalMediasReady = ({
  open,
  loading,
  onClose,
  items,
}: IModalMediasReady) => {
  const tenantCatalogs = React.useContext(ContextCatalogs);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    catalogs,
    views,
    saveClicked,
    saving,
    skipItemsReady,
    skipItemsReview,
    onlyItemsChecked,
  } = state;
  const onClickConfirm = React.useCallback(() => {
    dispatch({ type: ACTION.SAVE_CLICK });
  }, []);
  const onSelectCatalogs = React.useCallback((changedItems, newItems) => {
    dispatch({ type: ACTION.CHANGE_CATALOGS, changedItems, newItems });
  }, []);
  const onSelectViews = React.useCallback((changedItems, newItems) => {
    dispatch({ type: ACTION.CHANGE_VIEWS, changedItems, newItems });
  }, []);
  const onToggleSkipReviewItems = React.useCallback(() => {
    dispatch({ type: ACTION.TOGGLE_SKIP_REVIEW });
  }, []);
  const onToggleSkipReadyItems = React.useCallback(() => {
    dispatch({ type: ACTION.TOGGLE_SKIP_READY });
  }, []);
  const onToggleSkipCheckedItems = React.useCallback(() => {
    dispatch({ type: ACTION.TOGGLE_SKIP_CHECKED });
  }, []);
  const {
    readySets,
    countItemsToApply,
    countItemsInReady,
    countItemsInReview,
    countItemsInChecked,
  } = getReadySets({
    items,
    catalogs,
    views,
    skipItemsReady,
    skipItemsReview,
    onlyItemsChecked,
  });
  const thereAreCatalogSelected = !!catalogs.find(
    (catalog: IMultiReadyCatalog) => catalog.selected
  );
  const thereAreMedias = !!items.find(
    (item) => !isEmpty(item[KEY_MEDIA] || [])
  );
  const thereAreViewStatus = !!items.find(
    (item) => !isEmpty(item[KEY_VIEW_DATA] || [])
  );
  const confirmDisabled =
    isEmpty(readySets) ||
    !thereAreCatalogSelected ||
    !thereAreMedias ||
    !thereAreViewStatus;
  const errorNoCatalog = isEmpty(catalogs);
  const tenantSingleCatalog = tenantCatalogs.length === 1;

  // when the modal is "open" and not "loading", save the new item's catalogs into the reducer
  React.useEffect(() => {
    if (open && !loading)
      dispatch({ type: ACTION.INIT, tenantCatalogs, items });
  }, [open, loading, tenantCatalogs, items]);

  // when close the modal, reset the reducer state
  React.useEffect(() => {
    if (!open && !isEmpty(items)) dispatch({ type: ACTION.RESET });
  }, [open, items]);

  // when clicked CONFIRM, fetch data
  React.useEffect(() => {
    (async () => {
      if (saveClicked && !saving && !isEmpty(items)) {
        dispatch({ type: ACTION.SAVING });
        try {
          await multiReady(readySets, ContentType.MEDIA);
          setSnackbar(Severity.SUCCESS, "Ready Status will be applied soon");
        } catch (err) {
          console.warn("ModalMassiveMediaReady: ", err);
          setSnackbar(
            Severity.WARNING,
            "Unable to apply Ready Status, please refresh and retry"
          );
        }
        dispatch({ type: ACTION.SAVE_STOP });
        onClose();
      }
    })();
  }, [items, onClose, readySets, saveClicked, saving, setSnackbar]);

  const modalLoading = isEmpty(items) || loading || saveClicked || saving;

  if (errorNoCatalog) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        loading={modalLoading}
        title="Can’t apply Ready status"
        content={
          <Typography
            variant="body1"
            children="This action can’t be done because there aren’t catalogs assigned to the current selection of products"
          />
        }
        actions={
          <>
            <div style={{ flex: 1 }} />
            <Btn
              color={Colors.Green}
              variant="bold"
              label="OK, I UNDERSTAND"
              onClick={onClose}
            />
          </>
        }
      />
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      loading={modalLoading}
      title="Apply Ready Status"
      titleSub={
        <>
          <span children="Ready status will be applied only to views in which" />
          <br />
          <span children="last media uploaded is a video or post-production media" />
        </>
      }
      content={
        <>
          <Divider />
          <div className={classes.dialogContent}>
            {tenantSingleCatalog ? null : (
              <>
                <SelectCatalogs
                  catalogs={catalogs}
                  views={views}
                  onChange={onSelectCatalogs}
                />
                <ListDivider />
              </>
            )}
            <SelectViews
              catalogs={catalogs}
              views={views}
              onChange={onSelectViews}
            />
          </div>
          <Divider />
        </>
      }
      actions={
        <Footer
          btnItemsCheckedOnToggle={onToggleSkipCheckedItems}
          btnItemsCheckedSelected={onlyItemsChecked}
          btnItemsCheckedCount={countItemsInChecked}
          //
          btnItemsReviewOnToggle={onToggleSkipReviewItems}
          btnItemsReviewSelected={skipItemsReview}
          btnItemsReviewCount={countItemsInReview}
          //
          btnItemsReadyOnToggle={onToggleSkipReadyItems}
          btnItemsReadySelected={skipItemsReady}
          btnItemsReadyCount={countItemsInReady}
          //
          itemsToApplyCount={countItemsToApply}
          confirmDisabled={confirmDisabled}
          onConfirm={onClickConfirm}
          onCancel={onClose}
        />
      }
    />
  );
};

export default ModalMediasReady;
