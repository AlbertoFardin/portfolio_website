import {
  IProduct,
  IViewData,
  IViewStatus,
  IViewDetail,
  ViewStatus,
  IViewCheck,
  ViewCheck,
} from "../../interfaces";
import {
  KEY_VIEW_DATA,
  KEY_VIEW_STATUS,
  KEY_VIEW_CHECK,
} from "../../constants";

const getViewDetail = (item: IProduct, vName: string): IViewDetail => {
  const getView = ({ viewName }) => viewName === vName;

  const vData: IViewData = (item[KEY_VIEW_DATA] || []).find(getView);
  const vStatus: IViewStatus = (item[KEY_VIEW_STATUS] || []).find(getView);
  const vCheck: IViewCheck = (item[KEY_VIEW_CHECK] || []).find(getView);

  const status = (vStatus && vStatus.status) || ViewStatus.DEFAULT;
  const check = (vCheck && vCheck.check) || ViewCheck.NO_CHECK;

  return {
    ...vData,
    status,
    check,
  };
};

export default getViewDetail;
