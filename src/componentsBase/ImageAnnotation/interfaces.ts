/* eslint-disable @typescript-eslint/no-explicit-any */
import IUser from "../IUser";

export interface IPoint {
  x: number;
  y: number;
}

export interface IAnnotationData {
  id?: string;
  color?: string;
  resolved?: boolean;
  dateUpdated?: number;
  dateCreated?: number;
  value?: string;
}

export interface IAnnotationGeometry extends IPoint {
  type?: string;
  points?: IPoint[];
}

export interface IAnnotationEditable {
  color?: boolean;
  value?: boolean;
  resolved?: boolean;
  delete?: boolean;
}

export interface IAnnotationSelection {
  anchorX?: number;
  anchorY?: number;
  mode?: string;
}

export interface IAnnotation {
  data: IAnnotationData;
  geometry?: IAnnotationGeometry;
  editable: IAnnotationEditable;
  selection?: IAnnotationSelection;
  user: IUser;
  mentions: IUser[];
}

export interface ISelectors {
  TYPE: string;
  intersects: (...k: any) => any;
  area: (...k: any) => any;
  methods: any;
}

export const draftId = undefined;
