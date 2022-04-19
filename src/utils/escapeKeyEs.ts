// LINK https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_reserved_characters
// LINK https://wardafactory.atlassian.net/browse/SEECOMM-4474
const escapeKeyEs = (text: string): string => {
  return text.replace(/[&|/!<>\+\-\={}[\]()^"~*?:]/g, "\\$&");
};

export default escapeKeyEs;
