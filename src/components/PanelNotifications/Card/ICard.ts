import { INotification } from "../../../interfaces";

interface ICard {
  dispatch: React.Dispatch<unknown>;
  notification: INotification;
}

export default ICard;
