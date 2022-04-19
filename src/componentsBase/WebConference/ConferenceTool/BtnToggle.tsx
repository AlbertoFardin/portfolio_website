import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Btn from "../../Btn";
import * as Colors from "../../style/Colors";

interface IBtnToggle {
  enabled: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  className?: string;
  permission?: boolean;
}

const BtnToggle = ({
  enabled,
  onClick,
  icon,
  label,
  className,
  permission = true,
}: IBtnToggle) => {
  const off = !permission || !enabled;
  return (
    <Btn
      className={className}
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
      onClick={onClick}
      disabled={!permission}
    />
  );
};

export default BtnToggle;
