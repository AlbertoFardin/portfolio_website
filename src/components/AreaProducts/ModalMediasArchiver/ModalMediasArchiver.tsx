import Btn from "../../../componentsBase/Btn";
import * as Colors from "../../../componentsBase/style/Colors";
import * as React from "react";
import {
  IProduct,
  IMedia,
  Severity,
  MediaType,
  Category,
} from "../../../interfaces";
import { getWebSocketConnectionId } from "../../webSocket";
import {
  search,
  massiveDownloadRenamedSeecommerce,
} from "../../../api/fetchesApi";
import { ACTION_MAIN } from "../../reducer";
import { INDEX_NAME, KEY_ENTITY_TYPE, KEY_MEDIA } from "../../../constants";
import { v4 as uuidv4 } from "uuid";
import {
  FieldSelect,
  ILabel,
  ILabelPositionX,
  ILabelPositionY,
} from "../../../componentsBase/Field";
import useStyles from "./useStyles";
import {
  reducer,
  initialState,
  FIELD_IDS,
  ACTION,
  STATUS_DOWNLOAD,
} from "./reducer";
import last from "lodash-es/last";
import { ContextDispatchMain, ContextSetSnackbar } from "../../contexts";
import getViewDetail from "../getViewDetail";
import Modal from "../../Modal";
import { ContextCategories, ContextColumns } from "../contexts";
import getAttributeKey from "../getAttributeKey";
import getMostRecentMediaContent from "./getMostRecentMediaContent";
import getProducts from "../getProducts";

const getSelectLabel = (label): ILabel[] => [
  {
    id: "label",
    label,
    required: true,
    positionX: ILabelPositionX.left,
    positionY: ILabelPositionY.top,
  },
];

interface IModalMediasArchiver {
  open: boolean;
  itemsIdSelected: string[];
  onClose: () => void;
}

const ModalMediasArchiver = ({
  open,
  itemsIdSelected,
  onClose,
}: IModalMediasArchiver) => {
  const dispatchMain = React.useContext(ContextDispatchMain);
  const columns = React.useContext(ContextColumns);
  const categories = React.useContext(ContextCategories);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const classes = useStyles({ alert });
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { loading, items, statusDownload } = state;
  const selectFilesNames = state[FIELD_IDS.selectFilesNames];
  const selectMediaTypes = state[FIELD_IDS.selectMediaTypes];
  const selectCategories = state[FIELD_IDS.selectCategories];
  const checkPostproduct = state[FIELD_IDS.checkPostproduct];
  const checkLastupload = state[FIELD_IDS.checkLastupload];

  const onChangeMediatype = React.useCallback((e, value) => {
    dispatch({
      type: ACTION.SET_VALUES,
      id: [FIELD_IDS.selectMediaTypes],
      value,
    });
  }, []);
  const onChangeFilesname = React.useCallback((e, value) => {
    dispatch({
      type: ACTION.SET_VALUES,
      id: [FIELD_IDS.selectFilesNames],
      value,
    });
  }, []);
  const onChangeCategory = React.useCallback((e, value) => {
    dispatch({
      type: ACTION.SET_VALUES,
      id: [FIELD_IDS.selectCategories],
      value,
    });
  }, []);
  const onChangePostproduction = React.useCallback(() => {
    dispatch({
      type: ACTION.SET_VALUES,
      id: [FIELD_IDS.checkPostproduct],
      value: !checkPostproduct,
    });
  }, [checkPostproduct]);
  const onChangeLastupload = React.useCallback(() => {
    dispatch({
      type: ACTION.SET_VALUES,
      id: [FIELD_IDS.checkLastupload],
      value: !checkLastupload,
    });
  }, [checkLastupload]);
  const onStartDownload = React.useCallback(() => {
    dispatch({
      type: ACTION.SET_STATUS,
      status: STATUS_DOWNLOAD.TO_START,
    });
  }, []);
  const itemsSameLevel =
    new Set(items.map((a) => a[KEY_ENTITY_TYPE])).size === 1;
  const mediaName = selectFilesNames.find((a) => a.selected);
  const mediaContents: {
    fileId: string;
    customName: string;
    path: string[];
    uploaded: number;
  }[] = React.useMemo(() => {
    const setMediaType = new Set(
      selectMediaTypes.reduce((acc, m) => {
        if (m.selected) acc.push(m.id);
        return acc;
      }, [])
    );
    const setCategory = new Set(
      selectCategories.reduce((acc, m) => {
        if (m.selected) acc.push(m.id);
        return acc;
      }, [])
    );
    const medias = items.reduce(
      (
        acc: {
          fileId: string;
          customName: string;
          path: string[];
          uploaded: number;
          mediaType: MediaType;
          category: Category;
        }[],
        item: IProduct
      ) => {
        const itemMedia = (item[KEY_MEDIA] || []) as IMedia[];
        itemMedia.forEach((media) => {
          const {
            filename,
            fileId,
            mediaType,
            postProduce,
            view,
            uploaded,
          } = media;
          const viewDetail = getViewDetail(item, view);
          const { category } = viewDetail;
          const cPostproce = checkPostproduct === false ? true : postProduce;
          const cMediaType = setMediaType.has(mediaType);
          const cCategory = setCategory.has(category);

          if (cPostproce && cMediaType && cCategory) {
            let newFileName = filename;

            if (!!mediaName && mediaName.id) {
              const extension = last(filename.split("."));
              const column = columns.find(
                (c) => c.attributeStructureId === mediaName.id
              );
              newFileName =
                item[getAttributeKey(column)] + `_${view}` + `.${extension}`;
            }

            acc.push({
              fileId,
              customName: newFileName,
              path: [mediaType, category],
              uploaded,
              mediaType,
              category,
            });
          }
        });

        return acc;
      },
      []
    );
    if (checkLastupload) {
      console.log({ medias });
      const res = getMostRecentMediaContent(medias);
      console.log({ res });
      return res;
    }
    return medias;
  }, [
    checkLastupload,
    checkPostproduct,
    columns,
    items,
    mediaName,
    selectCategories,
    selectMediaTypes,
  ]);

  const mediaCount = Object.keys(mediaContents).length;

  // get items data and downloads config
  React.useEffect(() => {
    if (loading && open)
      (async () => {
        const config = await search({ index: INDEX_NAME.CONFIG });
        const mediaName = (config.items.find((a) => {
          return a.id === "media_alternative_names";
        }).data as { items: { alternative_name: string }[] }).items;
        const mediaNameIds = !mediaName
          ? []
          : mediaName.map((a) => a.alternative_name);
        const items = await getProducts({
          ids: itemsIdSelected,
          columns,
          categories,
        });

        dispatch({ type: ACTION.START, items, columns, mediaNameIds });
      })();
  }, [categories, columns, itemsIdSelected, loading, open]);

  // start download
  React.useEffect(() => {
    const someSelected = selectMediaTypes.some((m) => m.selected);
    const downloadToStart = statusDownload === STATUS_DOWNLOAD.TO_START;
    if (someSelected && downloadToStart) {
      (async () => {
        dispatch({
          type: ACTION.SET_STATUS,
          status: STATUS_DOWNLOAD.STARTED,
        });
        const correlationId = uuidv4();
        try {
          await massiveDownloadRenamedSeecommerce({
            correlationId,
            mediaContents: mediaContents.map(
              ({ fileId, customName, path }) => ({
                fileId,
                customName,
                path,
              })
            ),
            connectionId: getWebSocketConnectionId(),
          });

          // aggiungo al componente multiDownload l'elemento da mostrare
          dispatchMain({
            type: ACTION_MAIN.DOWNLOADS_TO_ADD,
            payload: {
              correlationId,
              filename: `${correlationId}.zip`,
            },
          });
        } catch (err) {
          setSnackbar(
            Severity.WARNING,
            "Unable to download media, please refresh and retry"
          );
        }
        onClose();
      })();
    }
  }, [
    dispatchMain,
    mediaContents,
    onClose,
    selectMediaTypes,
    setSnackbar,
    statusDownload,
  ]);

  // reset
  React.useEffect(() => {
    if (!open) dispatch({ type: ACTION.RESET });
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      loading={loading}
      title="Download Media"
      content={
        <>
          <FieldSelect
            label={getSelectLabel("File name")}
            value={selectFilesNames}
            className={classes.select}
            onChange={onChangeFilesname}
            readOnly={!itemsSameLevel || selectFilesNames.length === 1}
            itemsSelectedMaxLength={1}
          />
          <FieldSelect
            label={getSelectLabel("Media type")}
            value={selectMediaTypes}
            className={classes.select}
            onChange={onChangeMediatype}
          />
          <FieldSelect
            label={getSelectLabel("View category")}
            value={selectCategories}
            className={classes.select}
            onChange={onChangeCategory}
          />
          <Btn
            className={classes.btnMaxWidth}
            icon={checkPostproduct ? "check_box" : "check_box_outline_blank"}
            label="Only with post production request"
            onClick={onChangePostproduction}
          />
          <Btn
            className={classes.btnMaxWidth}
            icon={checkLastupload ? "check_box" : "check_box_outline_blank"}
            label="Only last upload"
            onClick={onChangeLastupload}
          />
        </>
      }
      actions={
        <>
          <div style={{ flex: 1 }} />
          <Btn variant="bold" label="CANCEL" onClick={onClose} />
          <Btn
            color={Colors.Green}
            variant="bold"
            label={!mediaCount ? "DOWNLOAD" : `DOWNLOAD (${mediaCount})`}
            onClick={onStartDownload}
            disabled={!mediaCount || !mediaName}
          />
        </>
      }
    />
  );
};

export default ModalMediasArchiver;
