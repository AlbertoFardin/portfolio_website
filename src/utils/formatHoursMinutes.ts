import * as moment from "moment";
import { DATE_FORMAT } from "../constants";

export default function (stringDate) {
  return moment(stringDate).format(`${DATE_FORMAT} HH:mm`);
}
