/* eslint-disable @typescript-eslint/no-explicit-any */
import IUser from "../../IUser";

export interface IConference {
  /** If true, show the modal to start/join a conference */
  open: boolean;
  /** Callback fired when conference has closed */
  onClose: () => void;
  /** Callback fired when MeetingSession has started */
  onSessionDidStart?: () => void;
  /** Callback fired when MeetingSession has stopped */
  onSessionDidStop?: () => void;
  /** Base URL of fetch API */
  baseUrl: string;
  /** Initial position where the "Tools" modal will be shown (position in px) */
  positionTool?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** Initial position where the "List panel attendees" modal will be shown (position in px) */
  positionPanelAttendees?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  /** Product code to restrict conference only to application with given productId */
  productId?: string;

  /** Get user info by id.
   *
   * IUser is the user interface with :
   *
   * - **id**: unique id
   * - **firstName** : first name
   * - **lastName** : last name
   * - **picture**: uri of avatar
   *
   */
  getUser: (id: string) => IUser;
  /** Enable/disable simulcast */
  simulcast?: boolean;
  /** Callback fired when token used is not valid */
  onAuthorizationFailed?: (err?) => void;
  /** Promise authenticated */
  fetchJwt: (k: {
    url: string;
    jwt?: string;
    method?: string;
    jsonBody?: any;
    additionalHeader?: any;
  }) => Promise<any>;
}
