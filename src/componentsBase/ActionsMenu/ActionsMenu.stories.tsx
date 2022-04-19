import * as React from "react";
import { action } from "@storybook/addon-actions";
import Btn from "../Btn";
import ActionsMenu from ".";
import InputFile from "../InputFile";
import CircularProgress from "@material-ui/core/CircularProgress";
import { emptyFn } from "../utils/common";
import { IGetAdditionalChildren } from "../ListItem/IListItem";

const AdditionalChildren = ({ onClose }: IGetAdditionalChildren) => {
  const onChangeInput = React.useCallback(
    (event) => {
      console.log("onChangeInput", event.target.files);
      onClose(event);
    },
    [onClose]
  );

  return (
    <>
      <InputFile
        acceptFiles={"*"}
        setHover={emptyFn}
        onChangeInput={onChangeInput}
        multiple
      />
      <CircularProgress size={15} />
    </>
  );
};

const Demo = (args) => {
  const rootRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const onOpen = React.useCallback(() => setOpen(true), []);
  const onClose = React.useCallback(() => setOpen(false), []);

  return (
    <div
      style={{
        width: "inherit",
        height: 150,
        border: "1px solid red",
        boxSizing: "border-box",
      }}
    >
      <Btn color={args.colorTheme} label="OPEN" onClick={onOpen} />
      <div
        ref={rootRef}
        style={{
          width: 15,
          height: 15,
          margin: "0 200px",
          backgroundColor: "red",
          display: "inline-block",
          verticalAlign: "middle",
        }}
      />
      {!open ? null : (
        <ActionsMenu
          {...args}
          open={open}
          onClose={onClose}
          anchorEl={rootRef.current}
        />
      )}
    </div>
  );
};

export default {
  title: "Components/ActionsMenu",
  component: ActionsMenu,
  args: {
    open: false,
    onClose: action("onClose"),
    actions: [
      {
        id: "font_download",
        label: "font_download",
        onClick: action("font_download"),
        icon: "font_download",
        disabled: true,
      },
      {
        id: "file_copy",
        label: "file_copy",
        onClick: action("file_copy"),
        icon: "file_copy",
      },
      {
        id: "send",
        label: "send",
        onClick: action("send"),
        icon: "send",
      },
      {
        divider: true,
        id: "edit",
        label: "edit",
        onClick: action("edit"),
        icon: "edit",
      },
      {
        divider: true,
        id: "Action_1",
        label: "Action_1",
        onClick: action("Action_1"),
        buttons: [
          {
            id: "delete",
            icon: "delete",
          },
          {
            id: "get_app",
            icon: "get_app",
          },
        ],
      },
      {
        id: "Action_2",
        label: "Action_2",
        onClick: action("Action_2"),
        buttons: [
          {
            id: "get_app",
            icon: "get_app",
          },
        ],
      },
      {
        divider: true,
        id: "upload",
        label: "upload22",
        onClick: action("Upload"),
        getAdditionalChildren: AdditionalChildren,
      },
    ],
  },
};

const Story = (args) => <Demo {...args} />;

export const Default = Story.bind({});
