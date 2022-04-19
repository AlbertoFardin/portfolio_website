import {
  IProduct,
  IAssignment,
  IAssignmentContentType,
  IAssignmentEntity,
  IViewData,
} from "../../../interfaces";
import { KEY_ASSIGNMENTS, KEY_VIEW_DATA } from "../../../constants";
import isEmpty from "lodash-es/isEmpty";
import { ACTION_CLICKED } from "./reducer";

interface IGetAssignmentsToSave {
  actionClicked: ACTION_CLICKED;
  selectedAssigneesId: string[];
  selectedViewsId: string[];
  items: IProduct[];
}

const getAssignmentsToSave = ({
  actionClicked,
  selectedAssigneesId,
  selectedViewsId,
  items,
}: IGetAssignmentsToSave): IAssignmentEntity[] => {
  const viewsIdSet = new Set(selectedViewsId);

  return items.reduce((assignmentsEntity, item: IProduct) => {
    const { id, version } = item;
    const viewsData = (item[KEY_VIEW_DATA] || []) as IViewData[];
    const assignments = (item[KEY_ASSIGNMENTS] || []) as IAssignment[];
    const assignmentsToAdd = [] as IAssignment[];
    const assignmentsToRemove = [] as IAssignment[];

    viewsData.forEach(({ viewName }) => {
      const viewSelected = viewsIdSet.has(viewName);
      if (viewSelected) {
        assignments
          .filter(({ id, contentType }) => {
            const checkType = contentType === IAssignmentContentType.VIEW;
            const checkName = id === viewName;
            return checkType && checkName;
          })
          .forEach((oldAssignment) => {
            assignmentsToRemove.push(oldAssignment);
          });

        if (actionClicked === ACTION_CLICKED.ASSIGN) {
          selectedAssigneesId.forEach((assignee) => {
            assignmentsToAdd.push({
              id: viewName,
              contentType: IAssignmentContentType.VIEW,
              assignee,
            });
          });
        }
      }
    });

    if (
      actionClicked !== ACTION_CLICKED.NONE &&
      (!isEmpty(assignmentsToAdd) || !isEmpty(assignmentsToRemove))
    ) {
      assignmentsEntity.push({
        entityId: id,
        version,
        assignmentsToAdd,
        assignmentsToRemove,
      });
    }

    return assignmentsEntity;
  }, [] as IAssignmentEntity[]);
};

export default getAssignmentsToSave;
