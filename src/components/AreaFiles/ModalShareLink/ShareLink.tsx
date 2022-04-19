import * as React from "react";
import Typography from "@material-ui/core/Typography";
import FieldText from "../../../componentsBase/Field/FieldText";
import Btn from "../../../componentsBase/Btn";
import { SHARE_ID, TYPE_FOLDER } from "../../../constants";
import * as Colors from "../../../componentsBase/style/Colors";
import { shareFile } from "../../../api/fetchesApi";
import useStyles from "./useStylesShare";
import IShare from "./IShare";
import { ContextSetSnackbar } from "../../contexts";
import { Severity } from "../../../interfaces";
import { errorSomethingWrong } from "../constants";
import Spinner from "./Spinner";

const ShareLink = ({ onUpdate, assetData, onCancel }: IShare) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const { id, mimeType, canEdit, publicshares } = assetData;
  const [createLink, setCreateLink] = React.useState(false);
  const [deleteLink, setDeleteLink] = React.useState(false);
  const classes = useStyles({});
  const isFolder = mimeType === TYPE_FOLDER;
  const onCreate = React.useCallback(() => {
    setCreateLink(true);
  }, []);
  const onDelete = React.useCallback(() => {
    setDeleteLink(true);
  }, []);
  const onCopy = React.useCallback(() => {
    setSnackbar(Severity.INFO, "SeeCommerce link copied to clipboard");
  }, [setSnackbar]);

  const infoShareFile = publicshares?.find((p) => p.root);
  const { accesscode, availability } = infoShareFile || {
    accesscode: "",
    availability: false,
  };
  const url = !accesscode
    ? ""
    : `${window.location.origin}/${SHARE_ID}?link=${accesscode}`;
  const loading = createLink || deleteLink;

  React.useEffect(() => {
    (async () => {
      try {
        if (createLink) {
          const newItem = await shareFile({
            fileId: id,
            isFolder,
            action: "create",
          });
          onUpdate(newItem);
          setCreateLink(false);
        }
      } catch {
        setSnackbar(Severity.WARNING, errorSomethingWrong);
        onCancel();
      }
    })();
  }, [createLink, id, isFolder, onCancel, onUpdate, setSnackbar]);

  React.useEffect(() => {
    (async () => {
      if (deleteLink) {
        try {
          const newItem = await shareFile({
            fileId: id,
            isFolder,
            publicPageToken: accesscode,
            action: "delete",
          });
          onUpdate(newItem);
          setDeleteLink(false);
        } catch {
          setSnackbar(Severity.WARNING, errorSomethingWrong);
          onCancel();
        }
      }
    })();
  }, [accesscode, deleteLink, id, isFolder, onCancel, onUpdate, setSnackbar]);

  React.useEffect(() => {
    if (id) {
      setCreateLink(false);
      setDeleteLink(false);
    }
  }, [id]);

  return (
    <div className={classes.link}>
      <Typography variant="h3" children="Get link to SeeCommerce share page" />
      <Typography
        variant="caption"
        style={{ color: Colors.Gray2, marginTop: 5 }}
        children="The file or folder will be displayed through a public share page of SeeCommerce. Anyone with the link can view this file/folder."
      />
      <div className={classes.row}>
        {!loading ? null : <Spinner />}
        <FieldText
          value={url}
          placeholder={
            loading ? "Loading..." : "A share page link has not been created"
          }
          readOnly
          className={classes.linkField}
        />
        <Btn
          tooltip="Copy link"
          icon="content_copy"
          color={Colors.Cyan}
          copyToClipboard={url}
          onClick={onCopy}
          disabled={loading || !url || !availability}
        />
      </div>
      <div className={classes.linkFooter}>
        <div className={classes.flex1} />
        {!canEdit ? null : url ? (
          <Btn
            variant="bold"
            color={Colors.Red}
            label={"delete link".toLocaleUpperCase()}
            onClick={onDelete}
            disabled={loading || !availability}
          />
        ) : (
          <Btn
            variant="bold"
            color={Colors.Green}
            label={"create link".toLocaleUpperCase()}
            onClick={onCreate}
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ShareLink;
