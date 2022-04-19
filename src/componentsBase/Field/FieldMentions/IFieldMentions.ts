import IUser from "../../IUser";
import { ILabel } from "../Label";

interface IFieldMentions {
  /** If true, the input will autofocused */
  autoFocus?: boolean;
  /** Component CSS classes */
  className?: string;
  /** component CSS style */
  style?: React.CSSProperties;
  /** Component' s label */
  label?: string | ILabel[] | React.ReactElement;
  /** Callback fired on change input */
  onChange?: (value: string, mentions: IUser[]) => void;
  /** Component's placeholder */
  placeholder?: string;
  /** If true, the input element is in read only */
  readOnly?: boolean;
  /** Array of users.
   *
   * IUser is the user interface with :
   *
   * - **id**: unique id
   * - **firstName** : first name
   * - **lastName** : last name
   * - **picture**: uri of avatar
   *
   */
  users: IUser[];
  /** Component's text value */
  value?: string;
}

export default IFieldMentions;
