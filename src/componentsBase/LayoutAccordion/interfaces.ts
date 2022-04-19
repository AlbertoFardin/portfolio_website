export interface ILayoutAccordion {
  /** Component ClassName */
  className?: string;
  /** Callback fire on panel expand or collapse */
  onChange?: (id: string, expanded: boolean) => void;
  /** Array di componenti la cui è interfaccia è composta da:
   *
   * - **id** :identificativo univoco del panel
   * - **contentNode** : ReactNode del body
   * - **headerNode** : ReactNode della header
   */
  panels: IPanel[];
  /** Component CSS style */
  style?: React.CSSProperties;
  /** Identificativo del Panel inizialmente espanso */
  initExpandedId?: string;
}

export interface IPanel {
  id: string;
  headerNode: React.ReactNode;
  contentNode: React.ReactNode;
}
