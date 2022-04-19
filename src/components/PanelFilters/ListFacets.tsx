import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  IFacetType,
  FacetBoolean,
  FacetDatePicker,
  FacetPercentage,
  IFacetBoolean,
  IFacetDatePicker,
  IFacetBase,
  IFacetTextarea,
  IFacetPercentage,
} from "../../componentsBase/Facets";
import FacetBase from "../../componentsBase/Facets/utils/FacetBase";
import Typography from "@material-ui/core/Typography";
import { DATE_FORMAT } from "../../constants";
import {
  IFilter,
  ISearchEs,
  IResultEs,
  ICatalog,
  IColumnSc,
} from "../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import FacetTextAreaSwitch from "./FacetTextAreaSwitch";
import FacetSearchUsers from "./FacetSearchUsers";
import FacetSearchDictionaries from "./FacetSearchDictionaries";
import FacetSearchStrings from "./FacetSearchStrings";
import FacetSearchCategories from "./FacetSearchCategories";

const getDisabled = (
  f: IFilter,
  catalogs: ICatalog[],
  catalogId: string,
  languageId: string
): boolean => {
  if (catalogs.length === 1) return false;
  return (f.multiCatalog && !catalogId) || (f.multiLanguage && !languageId);
};
const getSubLabel = (
  f: IFilter,
  catalogs: ICatalog[],
  catalogId: string,
  languageId: string
): string => {
  const disabled = getDisabled(f, catalogs, catalogId, languageId);
  const catalog = catalogs.find((c) => c.id === catalogId);
  if (catalogs.length === 1 || disabled || !f.multiCatalog || !catalog) {
    return undefined;
  }
  return (
    `Searching in ${catalog.displayName}` +
    (f.multiLanguage ? `- ${languageId.toLocaleUpperCase()}` : "")
  );
};
const useStyles = makeStyles({
  list: {
    position: "relative",
    flex: 1,
    "overflow-x": "hidden",
    "overflow-y": "overlay",
    display: "flex",
    "flex-direction": "column",
    "margin-left": 20,
    "padding-right": 15,
    "padding-bottom": 20,
  },
  listPlaceholder: {
    "margin-top": 15,
    "text-align": "center",
    color: Colors.Gray2,
  },
  facet: {
    margin: "5px 0",
  },
});

interface IListFacets {
  columns?: IColumnSc[];
  facets: IFilter[];
  onChange: (a: IFilter) => void;
  searchEs?: (k: ISearchEs) => Promise<IResultEs>;
  catalogs?: ICatalog[];
  catalogId?: string;
  languageId?: string;
  facetsOverrideMap?: {
    [id: string]: (
      p:
        | IFacetDatePicker
        | IFacetBoolean
        | IFacetTextarea
        | IFacetPercentage
        | IFacetBase
    ) => JSX.Element;
  };
  children?: JSX.Element | React.ReactNode;
}

const ListFacets = ({
  columns = [],
  facets,
  onChange,
  searchEs,
  catalogs = [],
  catalogId,
  languageId,
  facetsOverrideMap = {},
  children,
}: IListFacets) => {
  const classes = useStyles({});

  if (isEmpty(facets))
    return (
      <Typography
        className={classes.listPlaceholder}
        variant={"caption"}
        children={"To Add more filter click the button above"}
      />
    );

  return (
    <div className={classes.list}>
      {children}
      {facets.map((f: IFilter) => {
        const { id, type, label } = f;
        const p = {
          ...f,
          key: id,
          onChange,
          dateFormat: DATE_FORMAT,
          searchEs,
          className: classes.facet,
          disabled: getDisabled(f, catalogs, catalogId, languageId),
          disabledInfo: "Please select a catalog to use this filter",
          subLabel: getSubLabel(f, catalogs, catalogId, languageId),
          catalogId,
          languageId,
          column: columns.find((c) => c.id === id),
        };

        if (facetsOverrideMap[id]) {
          const CustomFacet = facetsOverrideMap[id];
          return <CustomFacet {...p} />;
        }

        switch (type) {
          case IFacetType.USERSELECTION:
            return <FacetSearchUsers {...p} />;
          case IFacetType.CATEGORY:
            return <FacetSearchCategories {...p} />;
          case IFacetType.DICTIONARY:
            return <FacetSearchDictionaries {...p} />;
          case IFacetType.SELECTION:
          case IFacetType.MULTISELECTION:
            return <FacetSearchStrings {...p} />;
          case IFacetType.DATEPICKER:
            return <FacetDatePicker {...p} />;
          case IFacetType.TEXTAREA:
            return <FacetTextAreaSwitch {...p} />;
          case IFacetType.BOOLEAN:
            return <FacetBoolean {...p} />;
          case IFacetType.PERCENTAGE:
            return <FacetPercentage {...p} />;
          default:
            return (
              <FacetBase key={id} id={id} label={label} type={type}>
                <Typography
                  variant="body1"
                  style={{ marginLeft: 15, color: Colors.Gray2 }}
                  children={`Unknown type ${type}`}
                />
              </FacetBase>
            );
        }
      })}
    </div>
  );
};

export default ListFacets;
