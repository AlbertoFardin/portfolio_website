import Popover from "@material-ui/core/Popover";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LoadingMask from "../../../../../../componentsBase/LoadingMask";
import * as Colors from "../../../../../../componentsBase/style/Colors";
import concat from "lodash-es/concat";
import isEmpty from "lodash-es/isEmpty";
import without from "lodash-es/without";
import * as React from "react";
import * as moment from "moment";
import { IMedia } from "../../../../../../interfaces";
import { DATE_FORMAT } from "../../../../../../constants";
import ModalReadyCatalogsListItem, {
  ListItemIconType,
} from "./ModalReadyCatalogsListItem";
import IMediaCatalog from "./IMediaCatalog";
import ModalReadyCatalogsTitle from "./ModalReadyCatalogsTitle";
import ModalReadyCatalogsFooter from "./ModalReadyCatalogsFooter";

const useStyles = makeStyles({
  paper: {
    padding: 10,
    display: "flex",
    "flex-direction": "column",
  },
  divider: {
    margin: "10px 5px",
  },
});

interface IModalReadyCatalogs {
  /** Modal's anchor element */
  anchorEl: Element;
  /** View's catalogs */
  catalogs?: IMediaCatalog[];
  /** If true, show loading spinner */
  loading?: boolean;
  /** View's media ids */
  mediaIds?: string[];
  /** View's media id selected */
  mediaIdSelected: string;
  /** If true, the Modal is open */
  open?: boolean;
  /** Callback fired on Modal closed */
  onClose: () => void;
  /** Callback fired on click confirm */
  onConfirm: (
    catalogsToAdd: IMediaCatalog[],
    catalogsToRemove: IMediaCatalog[]
  ) => void;
  /** View's id */
  viewId: string;
}

const ModalReadyCatalogs = ({
  anchorEl,
  catalogs = [],
  loading = false,
  mediaIds = [],
  mediaIdSelected,
  open = false,
  onClose,
  onConfirm,
  viewId,
}: IModalReadyCatalogs) => {
  const classes = useStyles({});
  const [mediaCatalogsToAdd, setMediaCatalogsToAdd] = React.useState(
    [] as IMediaCatalog[]
  );
  const [mediaCatalogsToRemove, setMediaCatalogsToRemove] = React.useState(
    [] as IMediaCatalog[]
  );

  let isMediaSelectedReady = false;

  // find all catalogs ready for this View
  const viewCatalogsReady = catalogs.filter(({ media }) => {
    return !!media.find(({ fileId }: IMedia) => {
      if (fileId === mediaIdSelected) isMediaSelectedReady = true;
      return !!mediaIds.find((mId) => mId === fileId);
    });
  });

  // find all catalogs ready for this Media
  const mediaCatalogsReady = viewCatalogsReady.reduce(
    (acc, cat: IMediaCatalog) => {
      const catalogHasThisMedia = !!cat.media.find(
        (m: IMedia) => m.fileId === mediaIdSelected
      );
      if (catalogHasThisMedia) acc.push(cat);
      return acc;
    },
    []
  );
  // find all catalogs NOT ready for this Media
  const mediaCatalogsNotReady = catalogs.reduce((acc, cat: IMediaCatalog) => {
    const { media } = cat;
    const thisCatalogIsReady = !!media.find(
      (m: IMedia) => m.fileId === mediaIdSelected
    );
    if (!thisCatalogIsReady) acc.push(cat);
    return acc;
  }, []);

  // button CONFIRM conditions to be enabled
  const btnConfirmEnabled =
    false ||
    // when there are some catalogs to remove
    !!mediaCatalogsToRemove.length ||
    // when there are some catalogs to add
    !!mediaCatalogsToAdd.length ||
    // when there are some catalogs to be ready on another media of same view
    !!(viewCatalogsReady.length && !isMediaSelectedReady);
  const btnConfirmLabel = !isEmpty(mediaCatalogsToRemove) ? "REMOVE" : "APPLY";
  const btnConfirmColor = !isEmpty(mediaCatalogsToRemove)
    ? Colors.Red
    : Colors.Green;

  const catalogsSelectedCount = mediaCatalogsNotReady.reduce(
    (acc, cat: IMediaCatalog) => {
      const { id } = cat;
      const cR = !!viewCatalogsReady.find((c: IMediaCatalog) => c.id === id);
      const cS = !!mediaCatalogsToAdd.find((c: IMediaCatalog) => c.id === id);
      return !!cR || !!cS ? acc + 1 : acc;
    },
    0
  );
  const cbOnConfirm = React.useCallback(() => {
    if (!isEmpty(mediaCatalogsToRemove)) {
      onConfirm([], mediaCatalogsToRemove);
    } else {
      onConfirm(concat(viewCatalogsReady, mediaCatalogsToAdd), []);
    }
  }, [viewCatalogsReady, mediaCatalogsToAdd, mediaCatalogsToRemove, onConfirm]);
  const cbOnItemAdd = React.useCallback(
    (id: string, selected: boolean) => {
      const cat = mediaCatalogsNotReady.find((c) => c.id === id);
      if (selected) {
        setMediaCatalogsToAdd(without(mediaCatalogsToAdd, cat));
      } else {
        setMediaCatalogsToAdd(concat(mediaCatalogsToAdd, cat));
      }
      setMediaCatalogsToRemove([]);
    },
    [mediaCatalogsToAdd, mediaCatalogsNotReady]
  );
  const cbOnItemRemove = React.useCallback(
    (id: string, selected: boolean) => {
      const cat = mediaCatalogsReady.find((c) => c.id === id);
      if (selected) {
        setMediaCatalogsToRemove(without(mediaCatalogsToRemove, cat));
      } else {
        setMediaCatalogsToRemove(concat(mediaCatalogsToRemove, cat));
      }
      setMediaCatalogsToAdd([]);
    },
    [mediaCatalogsToRemove, mediaCatalogsReady]
  );

  React.useEffect(() => {
    if (open) {
      setMediaCatalogsToAdd([]);
      setMediaCatalogsToRemove([]);
    }
  }, [open]);

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      PaperProps={{
        className: classes.paper,
      }}
      BackdropProps={{
        open: true,
        invisible: true,
      }}
    >
      {isEmpty(mediaCatalogsNotReady) ? null : (
        <>
          <ModalReadyCatalogsTitle
            label={catalogsSelectedCount ? "Set Ready" : "Not Ready"}
            count={catalogsSelectedCount}
          />
          {mediaCatalogsNotReady.map(({ id, label }: IMediaCatalog) => {
            const readOnly = !!viewCatalogsReady.find(
              (c: IMediaCatalog) => c.id === id
            );
            const selected = !!mediaCatalogsToAdd.find(
              (c: IMediaCatalog) => c.id === id
            );
            return (
              <ModalReadyCatalogsListItem
                key={id}
                type={ListItemIconType.SELECT}
                id={id}
                label={label}
                selected={selected || readOnly}
                readOnly={readOnly}
                onClick={cbOnItemAdd}
              />
            );
          })}
        </>
      )}

      {isEmpty(mediaCatalogsReady) || isEmpty(mediaCatalogsNotReady) ? null : (
        <Divider className={classes.divider} />
      )}

      {isEmpty(mediaCatalogsReady) ? null : (
        <>
          <ModalReadyCatalogsTitle
            label={mediaCatalogsToRemove.length ? "Set not Ready" : "Ready"}
            count={mediaCatalogsToRemove.length}
          />
          {mediaCatalogsReady.map(({ id, label, media }: IMediaCatalog) => {
            const selected = !!mediaCatalogsToRemove.find(
              (c: IMediaCatalog) => c.id === id
            );
            const dateUploaded = media.find((m: IMedia) => m.view === viewId)
              .uploaded;
            return (
              <ModalReadyCatalogsListItem
                key={id}
                type={ListItemIconType.REMOVE}
                id={id}
                label={label}
                selected={selected}
                labelDate={moment(dateUploaded).format(DATE_FORMAT)}
                onClick={cbOnItemRemove}
              />
            );
          })}
        </>
      )}

      <ModalReadyCatalogsFooter
        confirmDisabled={!btnConfirmEnabled}
        confirmLabel={btnConfirmLabel}
        confirmColor={btnConfirmColor}
        onConfirm={cbOnConfirm}
        onCancel={onClose}
      />

      <LoadingMask open={loading} backgroundColor="rgba(250,250,250,0.5)" />
    </Popover>
  );
};

export default ModalReadyCatalogs;
