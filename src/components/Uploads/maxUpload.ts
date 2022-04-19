// TODO Funzione TEMPORANEA DA CANCELLARE PER VALUTARE LA SEECOMM-3484
const speed = !!global.location
  ? new URLSearchParams(global.location.search).get("uploadspeed")
  : "";

/*
  1 ---> slowest
  2 ---> slow
  3 ---> medium
  4 ---> fast
  5 ---> faster
  6 ---> fastest
*/

const mapSpeed = {
  slowest: 1,
  slow: 2,
  medium: 3,
  fast: 4,
  faster: 5,
  fastest: 6,
};

const MAX_UPLOAD =
  process.env.ENV === "prod" ? 1 : Number(mapSpeed[speed] || 3);

export default MAX_UPLOAD;
