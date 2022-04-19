interface IConf {
  id: string;
  multiCatalog?: boolean;
  multiLanguage?: boolean;
  attributeStructureId?: string;
}

const getAttributeKey = (
  { id, multiCatalog, multiLanguage, attributeStructureId }: IConf,
  catalogId?: string,
  languageId?: string
): string => {
  //
  // fallback durante l'inizializzazione della Grid
  if (!id) return id;

  //
  // attributo di sistema
  if (!attributeStructureId) return id;

  //
  // attributo globale
  if (!multiCatalog) return id + ".().()";

  //
  // attributi multiCatalog e multiLanguage
  return id + `.(${catalogId}).(${multiLanguage ? languageId : ""})`;
};

export default getAttributeKey;

export const getAttributeId = (
  key: string
): { id: string; catalogId: string; languageId: string } => {
  //
  // attributo di sistema
  if (!key.includes(".(")) {
    return {
      id: key,
      catalogId: "",
      languageId: "",
    };
  }

  //
  // attributo globale o multiCatalog o multiLanguage
  const [attributeId, type, catalogId, languageId] = key
    .split(")")
    .join("")
    .split(".(");

  return {
    id: attributeId + `.(${type})`,
    catalogId,
    languageId,
  };
};
