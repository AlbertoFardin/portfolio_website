import { IAnnotation } from "../../../../../../componentsBase/ImageAnnotation";

export enum AnnotationAction {
  NONE = "NONE",
  CREATE = "CREATE",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
}

export enum ACTION {
  RESET = "RESET",
  IMG_SIZE = "IMG_SIZE",
  ANNOTATION_PENDING = "ANNOTATION_PENDING",
  ANNOTATION_RESET = "ANNOTATION_RESET",
}

interface IReducer {
  imgWidth: number;
  imgHeight: number;
  annotationAction: AnnotationAction;
  annotationPending: IAnnotation;
}

export const reducerInitState: IReducer = {
  imgWidth: 0,
  imgHeight: 0,
  annotationAction: AnnotationAction.NONE,
  annotationPending: null,
};

export const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.ANNOTATION_PENDING:
      newState.annotationAction = action.action;
      newState.annotationPending = action.annotation;
      return newState;
    case ACTION.ANNOTATION_RESET:
      newState.annotationAction = reducerInitState.annotationAction;
      newState.annotationPending = reducerInitState.annotationPending;
      return newState;
    case ACTION.IMG_SIZE:
      newState.imgHeight = action.height;
      newState.imgWidth = action.width;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      return newState;
  }
};
