import { Severity } from "../../interfaces";

interface IAlert {
  open: boolean;
  severity: Severity;
  message: string;
}

export default IAlert;
