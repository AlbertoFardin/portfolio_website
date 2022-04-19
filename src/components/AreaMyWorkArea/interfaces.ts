export enum ConfigType {
  FILTERS = "filter",
  COLUMNS = "column",
  DETAILS_PANEL = "detailPanel",
}

export interface IAttribute {
  id: string;
  label: string;
  level: string;
  [ConfigType.FILTERS]: {
    enabled: boolean;
    available: boolean;
    dirty: boolean;
  };
  [ConfigType.COLUMNS]: {
    enabled: boolean;
    available: boolean;
    dirty: boolean;
  };
  [ConfigType.DETAILS_PANEL]: {
    enabled: boolean;
    available: boolean;
    dirty: boolean;
  };
}

export interface IData {
  attributeFamily: string;
  attributes: IAttribute[];
}
