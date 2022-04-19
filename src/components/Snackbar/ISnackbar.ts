import { Severity } from "../../interfaces";

interface ISnackbar {
  open: boolean;
  message: string;
  severity: Severity;
}

export default ISnackbar;
