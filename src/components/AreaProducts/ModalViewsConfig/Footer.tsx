import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import * as Colors from "../../../componentsBase/style/Colors";
import isViewsCompleted from "./isViewsCompleted";
import { ACTION, IViewDraft, ViewStatus, FetchStatus } from "./reducer";
import StatusLabel from "./StatusLabel";

interface IFooter {
  dispatch: React.Dispatch<unknown>;
  views: IViewDraft[];
  fetching: boolean;
  countEditedPerformed: number;
  onClose: () => void;
}

const Footer = ({
  dispatch,
  views,
  fetching,
  countEditedPerformed,
  onClose,
}: IFooter) => {
  const viewsCompleted = isViewsCompleted(views);
  const countToRemove = views.filter((v) => v.status === ViewStatus.REMOVE)
    .length;
  const countToCreate = views.filter((v) => v.status === ViewStatus.CREATE)
    .length;
  const countToModify = views.filter((v) => v.status === ViewStatus.MODIFY)
    .length;
  const noViewToSave = !countToRemove && !countToCreate && !countToModify;
  const onConfirm = React.useCallback(() => {
    dispatch({ type: ACTION.FETCHING, value: FetchStatus.VIEWS_CHANGED });
  }, [dispatch]);
  const onReset = React.useCallback(() => {
    dispatch({ type: ACTION.CONFIRM_RESET, value: true });
  }, [dispatch]);

  return (
    <>
      {!countToRemove ? null : (
        <StatusLabel status={ViewStatus.REMOVE} count={countToRemove} />
      )}
      {!countToCreate ? null : (
        <StatusLabel status={ViewStatus.CREATE} count={countToCreate} />
      )}
      {!countToModify ? null : (
        <StatusLabel status={ViewStatus.MODIFY} count={countToModify} />
      )}
      <div style={{ flex: 1 }} />
      {!countEditedPerformed ? null : (
        <Btn
          color={Colors.Orange}
          tooltip="Reset view rules"
          label="Reset product view"
          icon="settings_backup_restore"
          onClick={onReset}
        />
      )}
      <Btn variant="bold" label="CANCEL" onClick={onClose} />
      <Btn
        variant="bold"
        color={Colors.Green}
        label="CONFIRM"
        onClick={onConfirm}
        disabled={fetching || noViewToSave || !viewsCompleted}
        tooltip={!viewsCompleted ? "Uncomplete configuration" : ""}
      />
    </>
  );
};

export default Footer;
