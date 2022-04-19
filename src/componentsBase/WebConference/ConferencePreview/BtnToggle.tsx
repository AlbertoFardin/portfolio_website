import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Btn from "../../Btn";
import * as Colors from "../../style/Colors";

interface IBtnToggle {
  icon: string;
  enabled: boolean;
  label: string;
  onToggle: (b: boolean) => void;
  permission: boolean;
}

const BtnToggle = ({
  icon,
  enabled,
  label,
  onToggle,
  permission,
}: IBtnToggle) => {
  const cbToggle = React.useCallback(() => onToggle(!enabled), [
    enabled,
    onToggle,
  ]);
  const off = !permission || !enabled;
  return (
    <Btn
      style={{ margin: 0, marginRight: 5 }}
      color={off ? Colors.Red : Colors.Green}
      icon={off ? `${icon}_off` : icon}
      tooltip={
        permission ? (
          `Enable/Disable ${label}`
        ) : (
          <>
            <Typography
              variant="caption"
              children={`Unable enable your ${label}`}
            />
            <br />
            <Typography
              variant="caption"
              children="Enable browser permission and refresh the page"
            />
          </>
        )
      }
      onClick={cbToggle}
      disabled={!permission}
    />
  );
};

export default React.memo(BtnToggle);
