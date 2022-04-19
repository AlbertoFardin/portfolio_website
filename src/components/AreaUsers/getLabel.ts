import { columns } from "./constants";

const getLabel = (id: string): string => {
  const column = columns.find((c) => c.id === id);

  if (!column) return "";
  return column.label;
};

export default getLabel;
