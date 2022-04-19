export default interface IViewport {
  /** content's node */
  content: React.ReactNode;
  /** sidepanel's node */
  sidepanel: React.ReactNode;
  /** sidepanel open */
  sidepanelOpen: boolean;
  /** sidepanel open width */
  sidepanelWidth: number;
  /** title's node */
  title?: React.ReactNode;
  /** toolbar's node */
  toolbar: React.ReactNode;
}
