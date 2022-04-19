export interface IListener {
  /** String to catch */
  toCatch: string;
  /** Callback to fire when catch code */
  onCatch: () => void;
}

interface ICatchCode {
  /** Array of code to add listener */
  listeners: IListener[];
  /** Children elemento to wrap */
  children;
}

export default ICatchCode;
