import * as React from "react";

const ClickManager = (props) => {
  const { onClick, onContextMenu } = props;
  const fnClick = React.useMemo(
    () => (event) => {
      if (onClick) {
        event.preventDefault();
        event.stopPropagation();
        const ctrlDown = event.ctrlKey || event.metaKey;
        const { shiftKey } = event;
        onClick({ ctrlDown, shiftKey }, event);
      }
    },
    [onClick]
  );

  const fnContextMenu = React.useMemo(
    () => (event) => {
      if (onContextMenu) {
        event.preventDefault();
        event.stopPropagation();
        onContextMenu(event);
      }
    },
    [onContextMenu]
  );

  return (
    <div
      {...props}
      role="presentation"
      onClick={fnClick}
      onContextMenu={fnContextMenu}
    />
  );
};

export default ClickManager;
