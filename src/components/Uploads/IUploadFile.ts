import IFileStatus from "./IFileStatus";

interface IUploadFile {
  id: string;
  file: File;
  sessionUploadId: string;
  status: IFileStatus;
  tooltip?: string;
  metadata?: { [k: string]: string };
}

export default IUploadFile;
