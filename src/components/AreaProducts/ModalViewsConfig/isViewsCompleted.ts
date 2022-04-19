import isEmpty from "lodash-es/isEmpty";
import { IViewDraft, ViewStatus } from "./reducer";

const isViewsCompleted = (views: IViewDraft[]): boolean => {
  // trovo la prima view che non risponde ai requisiti
  return !views.find((v: IViewDraft) => {
    // se è una view appena creata
    // deve avere tutti i requisiti
    if (v.status === ViewStatus.CREATE) {
      const { catalog, mediaType, viewType } = v.data;
      if (isEmpty(catalog) || !mediaType || !viewType) return true;
    }

    // se è una view modificata
    // si presuppone che i requisiti siano nell'item
    // si controlla solo che l'utente non abbia deselezionato tutti i catalog
    if (v.status === ViewStatus.MODIFY && v.data.catalog !== undefined) {
      if (isEmpty(v.data.catalog)) return true;
    }

    // negli altri casi significa che la view era già creata
    // quindi per forza possiede tutti i required
    return false;
  });
};

export default isViewsCompleted;
