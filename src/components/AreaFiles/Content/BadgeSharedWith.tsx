import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import BtnBadge from "../../../componentsBase/BtnBadge";
import { IShared, SharedRole } from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import { ORGANIZATION_ID } from "../constants";

const getShares = (sharedWith: IShared[]) => ({
  sharesPrivate: sharedWith.filter(({ id }) => id !== ORGANIZATION_ID),
  sharesOrganiz: sharedWith.filter(({ id }) => id === ORGANIZATION_ID),
});

export const getLabel = (sharedWith: IShared[]): string => {
  const { sharesPrivate, sharesOrganiz } = getShares(sharedWith);
  if (!isEmpty(sharesOrganiz)) {
    const role = sharesOrganiz[0].role;
    if (role === SharedRole.EDITOR) {
      return "All users can find and edit this item";
    }
    if (role === SharedRole.VIEWER) {
      return "All users can find and view this item";
    }
    if (role === SharedRole.VARIES) {
      return "Multiple settings applied";
    }
  }

  if (!isEmpty(sharesPrivate)) {
    return sharesPrivate.length === 1
      ? "The share is limitated at a specific user"
      : `The share is limitated at ${sharesPrivate.length} specific users`;
  }

  return "Only the owner can find and edit this item";
};

const getIcon = (sharedWith: IShared[]): string => {
  const { sharesPrivate, sharesOrganiz } = getShares(sharedWith);
  if (!isEmpty(sharesOrganiz)) return "business";
  if (!isEmpty(sharesPrivate)) return "people_alt";
  return "lock";
};

interface IBadgeSharedWith {
  sharedWith: IShared[];
  className?: string;
  style?: React.CSSProperties;
  tooltip?: string;
  onClick?: () => void;
}

const BadgeSharedWith = ({
  sharedWith,
  className,
  style,
  tooltip,
  onClick,
}: IBadgeSharedWith) => (
  <BtnBadge
    className={className}
    style={style}
    color={Colors.Cyan}
    icon={getIcon(sharedWith)}
    tooltip={tooltip}
    onClick={onClick}
  />
);

export default BadgeSharedWith;
