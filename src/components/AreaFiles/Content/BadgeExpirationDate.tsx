import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import BtnBadge from "../../../componentsBase/BtnBadge";

interface IBadgeExpirationDate {
  className?: string;
  style?: React.CSSProperties;
}

const BadgeExpirationDate = ({ className, style }: IBadgeExpirationDate) => {
  return (
    <BtnBadge
      color={Colors.Orange}
      className={className}
      style={style}
      icon="warning"
      tooltip="Copyright expiration date is expired"
    />
  );
};

export default BadgeExpirationDate;
