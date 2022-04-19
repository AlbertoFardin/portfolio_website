interface IInputFile {
  acceptFiles?: string;
  directory?: string;
  multiple?: boolean;
  onChangeInput: (event) => void;
  setHover?: (hover: boolean) => void;
}

export default IInputFile;
