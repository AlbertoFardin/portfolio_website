import {
  FiltersCondition,
  FileSection,
  ISort,
  IFilter,
} from "../../../interfaces";
import { ISearchFilesParams } from "./ISearch";
import { FIELD_ID } from "../constants";
import isFiltered from "../../FiltersChips/isFiltered";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFilterValue = (filters: IFilter[], id: string): any => {
  const filter = filters.find((f) => f.id === id);
  return (filter || {}).value;
};

interface IGetParams {
  from: number;
  size: number;
  sort: ISort;
  filters: IFilter[];
  filtersConditions: FiltersCondition;
  filtersThisFolder: boolean;
  pathId: string;
}

const getParams = ({
  from,
  size,
  sort,
  filters,
  filtersConditions,
  filtersThisFolder,
  pathId,
}: IGetParams): ISearchFilesParams => {
  const sortKey = !sort ? undefined : sort.id;
  const sortOrder = !sort ? undefined : sort.order;
  const filtered = isFiltered(filters);
  const p: ISearchFilesParams = {
    from,
    size,
    sortKey,
    sortOrder,
    queryFieldCondition: filtersConditions,
  };

  if (filtersThisFolder || !filtered) {
    p.queryParentFolder = pathId;
    if (pathId === FileSection.MY_FILES) {
      p.queryParentFolder = FileSection.MY_FILES;
    }
    if (pathId === FileSection.SHARES_PRIVATE) {
      p.queryParentFolder = FileSection.SHARES_PRIVATE;
    }
  }

  const fValueName = getFilterValue(filters, FIELD_ID.NAME);
  if (fValueName) {
    p.queryFieldName = (fValueName as string[]).join("");
  }

  const fValueTags = getFilterValue(filters, FIELD_ID.TAGS);
  if (fValueTags) {
    p.queryFieldTags = JSON.stringify(fValueTags.map(({ id }) => id));
  }

  const fValueCreated = getFilterValue(filters, FIELD_ID.CREATE);
  if (fValueCreated && fValueCreated.startDate) {
    p.queryFieldCreatedOnStart = fValueCreated.startDate;
  }
  if (fValueCreated && fValueCreated.endDate) {
    p.queryFieldCreatedOnEnd = fValueCreated.endDate;
  }

  const fValueExpiration = getFilterValue(filters, FIELD_ID.EXPIRATION);
  if (fValueExpiration && fValueExpiration.startDate) {
    p.queryFieldExpirationDateStart = fValueExpiration.startDate;
  }
  if (fValueExpiration && fValueExpiration.endDate) {
    p.queryFieldExpirationDateEnd = fValueExpiration.endDate;
  }

  return p;
};

export default getParams;
