import * as React from "react";
import Btn from "../../../componentsBase/Btn";

interface IBtnRefresh {
  searchStatus: string;
  setSearchTime: (n: number) => void;
}

const BtnRefresh = ({ setSearchTime, searchStatus }: IBtnRefresh) => {
  const loading = searchStatus === "loading";

  const onRefresh = React.useCallback(() => {
    setSearchTime(new Date().getTime());
  }, [setSearchTime]);

  return (
    <Btn
      icon="refresh"
      tooltip="Refresh"
      disabled={loading}
      onClick={onRefresh}
    />
  );
};

export default BtnRefresh;
