export interface IConferenceStart {
  open: boolean;
  onClose: () => void;
  onCreate: (roomId: string) => void;
  onJoin: (roomId: string) => void;
  onResetJoinError: () => void;
  onResetCreateError: () => void;
  createError?: string;
  createLoading?: boolean;
  joinError?: string;
  joinLoading?: boolean;
}
