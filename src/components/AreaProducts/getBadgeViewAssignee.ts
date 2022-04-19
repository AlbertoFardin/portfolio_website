import * as Colors from "../../componentsBase/style/Colors";
import { IBtn } from "../../componentsBase/Btn";
import {
  IUserProfile,
  IProduct,
  IViewDetail,
  IAssignment,
  IAssignmentContentType,
  IMenuViewAssegnees,
  IM2m,
} from "../../interfaces";
import { KEY_ASSIGNMENTS } from "../../constants";
import getUser from "../../utils/getUser";
import { ACT_VPORT } from "./reducer";

const color = Colors.Gray2;

interface IGetBadgeViewAssignee {
  dispatch: React.Dispatch<unknown>;
  item: IProduct;
  viewDetail: IViewDetail;
  users: IUserProfile[];
  m2ms: IM2m[];
  style?: React.CSSProperties;
  maxCount?: number;
}

const getBadgeViewAssignee = ({
  dispatch,
  item,
  viewDetail,
  users,
  m2ms,
  style,
  maxCount = 3,
}: IGetBadgeViewAssignee): IBtn[] => {
  const assignments = (item[KEY_ASSIGNMENTS] || []) as IAssignment[];
  const { viewName } = viewDetail;
  const viewAssegnees = assignments.filter(({ id, contentType }) => {
    const checkType = contentType === IAssignmentContentType.VIEW;
    const checkName = id === viewName;
    return checkType && checkName;
  });

  const badges: IBtn[] = [];

  for (let i = 0; i < maxCount; i++) {
    const viewAssegnee = viewAssegnees[i];
    if (!!viewAssegnee) {
      const userId = viewAssegnee.assignee;
      const { name, picture } = getUser(userId, { users, m2ms });
      const badge: IBtn = {
        color,
        avatar: picture,
        icon: picture ? undefined : "person",
        style,
        tooltip: `Assigned to ${name}`,
      };
      badges.push(badge);
    }
  }

  if (viewAssegnees.length > maxCount) {
    const onClick = (event) => {
      const data: IMenuViewAssegnees = {
        open: true,
        positionTop: event.clientY,
        positionLeft: event.clientX,
        viewAssegnees: viewAssegnees,
        viewDetail,
        item,
      };
      dispatch({ type: ACT_VPORT.MENU_VIEW_ASSIGNEES, data });
    };
    const othersCount = viewAssegnees.length - maxCount + 1;
    const badgeOthers: IBtn = {
      color,
      label: `+${othersCount}`,
      style,
      tooltip: `Assigned to other ${othersCount} users`,
      onClick,
    };

    badges.splice(badges.length - 1, 1, badgeOthers);
  }

  return badges;
};

export default getBadgeViewAssignee;
