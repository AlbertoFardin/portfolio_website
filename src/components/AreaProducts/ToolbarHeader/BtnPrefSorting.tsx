import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import { IContentSort } from "../../../interfaces";
import ModalSortingPreference from "../ModalSortingPreference";

interface IBtnPrefSorting {
  sortsContent: IContentSort[];
}

const BtnPrefSorting = ({ sortsContent }: IBtnPrefSorting) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const changeModalOpen = React.useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  return (
    <>
      <Btn
        icon="sort_by_alpha"
        tooltip="Show Sorting Preference"
        label={String(sortsContent.length)}
        onClick={changeModalOpen}
      />
      <ModalSortingPreference
        open={modalOpen}
        onClose={changeModalOpen}
        sortsContent={sortsContent}
      />
    </>
  );
};

export default BtnPrefSorting;
