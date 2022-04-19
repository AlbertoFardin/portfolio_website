export const prepareValue = (value: string | string[] = ""): string => {
  if (typeof value === "string") return value;
  return String(
    JSON.parse(
      JSON.stringify(
        value.reduce((acc, cur, i) => (!i ? cur : `${acc}\n${cur}`), "")
      )
    )
  );
};

export const prepareBadge = (value: string | string[] = ""): number => {
  if (!value) return 0;
  if (typeof value === "string") return 1;
  return value.filter((s) => !!s).length;
};
