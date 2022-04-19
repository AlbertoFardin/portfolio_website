import { IListItem } from "../ListItem";

interface IAction extends IListItem {
  divider?: boolean;
  hidden?: boolean;
  disableClose?: boolean;
}

export default IAction;
