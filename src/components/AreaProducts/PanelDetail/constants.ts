import { AttributeFamily } from "../../../interfaces";
import { colorTheme } from "../../../constants";
import mixColors from "../../../componentsBase/utils/mixColors";

export const HEADER_COLOR_BULK = mixColors(0.8, colorTheme, "#ffffff");
export const HEADER_COLOR = "#FAFBFC";

export const ATT_NO_LANG_ID = "untranslated"; // key coordinata col BE
export const ATT_NO_LANG_LABEL = "Untranslated";

export const FAMILY_CONF = [
  {
    id: AttributeFamily.MEDIA,
    label: "MEDIA",
    icon: "",
    bulk: false,
    children: [],
  },
  {
    id: AttributeFamily.CATEGORIES,
    label: "CATALOGS AND CATEGORIES",
    icon: "",
    bulk: true,
    children: [],
  },
  {
    id: AttributeFamily.ASSOCIATION,
    label: "ASSOCIATION",
    icon: "",
    bulk: true,
    children: [],
  },
  {
    id: AttributeFamily.ALL_ATTRIBUTES,
    label: "ALL ATTRIBUTES",
    icon: "",
    bulk: true,
    children: [
      AttributeFamily.MASTER,
      AttributeFamily.PLANNING,
      AttributeFamily.EDITORIAL,
      AttributeFamily.MONITORING,
      AttributeFamily.OTHERS,
    ],
  },
  {
    id: AttributeFamily.MASTER,
    label: "MASTER",
    icon: "arrow_right",
    bulk: false,
    children: [],
  },
  {
    id: AttributeFamily.PLANNING,
    label: "PLANNING",
    icon: "arrow_right",
    bulk: true,
    children: [],
  },
  {
    id: AttributeFamily.EDITORIAL,
    label: "EDITORIAL",
    icon: "arrow_right",
    bulk: true,
    children: [],
  },
  {
    id: AttributeFamily.MONITORING,
    label: "MONITORING",
    icon: "arrow_right",
    bulk: false,
    children: [],
  },
  {
    id: AttributeFamily.OTHERS,
    label: "OTHERS",
    icon: "arrow_right",
    bulk: false,
    children: [],
  },
];
