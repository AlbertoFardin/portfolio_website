export interface ILogin {
  title: string;
  backgroundNode?: JSX.Element | React.ReactNode;
  onLogin?: (
    username: string,
    password: string,
    tenant: string,
    cbFailure: (res) => void
  ) => void;
  onResetPassword?: () => void;
  onBackdropClick?: () => void;
}
