import * as React from "react";
import { CdnPublishedStatus, Severity } from "../../../interfaces";
import Typography from "@material-ui/core/Typography";
import FieldText from "../../../componentsBase/Field/FieldText";
import Btn from "../../../componentsBase/Btn";
import * as Colors from "../../../componentsBase/style/Colors";
import { publicCdn } from "../../../api/fetchesApi";
import useStyles from "./useStylesShare";
import IShare from "./IShare";
import { ContextSetSnackbar } from "../../contexts";
import concat from "lodash-es/concat";
import { errorSomethingWrong } from "../constants";
import Spinner from "./Spinner";

const ShareCdn = ({ onUpdate, assetData, onCancel }: IShare) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const { id, cdnUrls, cdnPublishedStatus, canEdit } = assetData;
  const [createLink, setCreateLink] = React.useState(false);
  const [deleteLink, setDeleteLink] = React.useState(false);
  const classes = useStyles({});
  const onCreate = React.useCallback(() => {
    setCreateLink(true);
  }, []);
  const onDelete = React.useCallback(() => {
    setDeleteLink(true);
  }, []);
  const onCopy = React.useCallback(() => {
    setSnackbar(Severity.INFO, "Direct link copied to clipboard");
  }, [setSnackbar]);
  const urlPublished = cdnPublishedStatus === CdnPublishedStatus.PUBLISHED;
  const url = urlPublished ? cdnUrls.original : "";
  const urlInProgress =
    cdnPublishedStatus === CdnPublishedStatus.IN_PUBLISHING ||
    cdnPublishedStatus === CdnPublishedStatus.IN_UNPUBLISHING;
  const loading = urlInProgress || createLink || deleteLink;

  React.useEffect(() => {
    (async () => {
      if (createLink || deleteLink) {
        try {
          const { files, folders } = await publicCdn({
            id,
            publicFile: createLink,
          });

          setCreateLink(false);
          setDeleteLink(false);
          onUpdate(concat(files, folders)[0]);
        } catch {
          setSnackbar(Severity.WARNING, errorSomethingWrong);
          onCancel();
        }
      }
    })();
  }, [createLink, deleteLink, id, onCancel, onUpdate, setSnackbar]);

  React.useEffect(() => {
    if (id) {
      setCreateLink(false);
      setDeleteLink(false);
    }
  }, [id]);

  return (
    <div className={classes.link}>
      <Typography variant="h3" children="Get file link" />
      <Typography
        variant="caption"
        style={{ color: Colors.Gray2, marginTop: 5 }}
        children="The file will be displayed or downloaded directly through browser. This link can be embedded in websites, email, sent via whatsapp etc. If link is enabled, anyone with the link can view the file."
      />
      <div className={classes.row}>
        {!loading ? null : <Spinner />}
        <FieldText
          value={loading ? "" : url}
          placeholder={
            loading ? "Loading..." : "The file link has not been enabled"
          }
          readOnly
          className={classes.linkField}
        />
        {!urlPublished ? null : (
          <Btn
            tooltip="Copy link"
            icon="content_copy"
            color={Colors.Cyan}
            copyToClipboard={url}
            onClick={onCopy}
            disabled={loading}
          />
        )}
      </div>
      <div className={classes.linkFooter}>
        <div className={classes.flex1} />
        {!canEdit ? null : urlPublished ? (
          <Btn
            variant="bold"
            color={Colors.Cyan}
            label={"disable link".toLocaleUpperCase()}
            onClick={onDelete}
            disabled={loading}
          />
        ) : (
          <Btn
            variant="bold"
            color={Colors.Green}
            label={"enable link".toLocaleUpperCase()}
            onClick={onCreate}
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ShareCdn;
