import { IFilter } from "../../interfaces";

export default (f: IFilter) => !!f && !f.sticky && f.searchable;
