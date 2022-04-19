import { colorTheme } from "../../../../constants";
import IAction from "../../../../componentsBase/ActionsMenu/IAction";

interface IGetMenuItem {
  id: string;
  label: string;
  active: boolean;
  divider?: boolean;
  onClick: (event: React.MouseEvent, id: string) => void;
  iconChecked?: string;
  iconUncheckd?: string;
}
const getMenuItem = ({
  id,
  label,
  active,
  divider,
  onClick,
  iconChecked = "check_box",
  iconUncheckd = "check_box_outline_blank",
}: IGetMenuItem): IAction => ({
  id,
  label,
  disableClose: true,
  active,
  divider,
  icon: active ? iconChecked : iconUncheckd,
  styleIcon: active ? { color: colorTheme } : {},
  onClick,
});

export default getMenuItem;
