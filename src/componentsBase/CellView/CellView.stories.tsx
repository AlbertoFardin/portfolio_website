import * as React from "react";
import { urlImage, urlImage2 } from "../__stories__/mediaUrls";
import AssetPreview from "../AssetPreview";
import AssetFolder from "../AssetFolder";
import CellView from ".";

const cellRender = ({
  data: { id, label, placeholderIcon, srcUrl, cellType },
  selected,
  colorTheme,
  cellWidth,
  cellHeight,
}) => {
  switch (cellType) {
    case "love":
    case "image":
      return (
        <AssetPreview
          id={id}
          key={id}
          label={label}
          placeholderIcon={placeholderIcon}
          srcUrl={srcUrl}
          selected={selected}
          style={{
            height: cellHeight - 6,
            width: cellWidth - 6,
          }}
          colorTheme={colorTheme}
        />
      );
    case "folder":
      return (
        <AssetFolder
          id={id}
          key={id}
          style={{
            height: cellHeight - 5,
            width: cellWidth - 5,
          }}
          label={label}
          colorTheme={colorTheme}
          selected={selected}
        />
      );
    default:
      return <div children="- NO_TYPE -" />;
  }
};
const cellHeight = () => 180;
const cellHeightDifferent = (rowType) => {
  switch (rowType) {
    case "love":
    case "image": {
      return 180;
    }
    case "folder": {
      return 50;
    }
    default: {
      return 50;
    }
  }
};
const items = [
  {
    cellType: "image",
    id: "image_1",
    label: "image_1",
    placeholderIcon: "photo",
    srcUrl: urlImage,
  },
  {
    cellType: "image",
    id: "image_2",
    label: "image_2",
    placeholderIcon: "photo",
    srcUrl: urlImage,
  },
  {
    cellType: "image",
    id: "image_3",
    label: "image_3",
    placeholderIcon: "photo",
    srcUrl: urlImage,
  },
];
const itemsDifferent = [
  {
    cellType: "folder",
    id: "folder_1",
    label: "folder_1",
  },
  {
    cellType: "folder",
    id: "folder_2",
    label: "folder_2",
  },
  {
    cellType: "image",
    id: "image_1",
    label: "image_1",
    placeholderIcon: "photo",
    srcUrl: urlImage,
  },
  {
    cellType: "image",
    id: "image_2",
    label: "image_2",
    placeholderIcon: "photo",
    srcUrl: urlImage,
  },
  {
    cellType: "image",
    id: "image_3",
    label: "image_3",
    placeholderIcon: "photo",
    srcUrl: urlImage,
  },
  {
    cellType: "image",
    id: "image_4",
    label: "image_4",
    placeholderIcon: "photo",
    srcUrl: urlImage,
  },
  {
    cellType: "image",
    id: "image_5",
    label: "image_5",
    placeholderIcon: "photo",
    srcUrl: urlImage,
  },
  {
    cellType: "love",
    id: "love_1",
    label: "love_1",
    placeholderIcon: "photo",
    srcUrl: urlImage2,
  },
  {
    cellType: "love",
    id: "love_2",
    label: "love_2",
    placeholderIcon: "photo",
    srcUrl: urlImage2,
  },
];
const headers = (cellType) => {
  switch (cellType) {
    case "image":
      return "Images";
    case "folder":
      return "Folders";
    default:
      return "";
  }
};

export default {
  title: "Components/CellView",
  component: CellView,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    colorTheme: "#00f",
    cellRender,
    cellWidth: 180,
    cellHeight,
    items,
  },
};

const Story = (args) => (
  <div
    style={{
      height: "100%",
      flex: 1,
      display: "flex",
      flexDirection: "row",
      position: "relative",
    }}
  >
    <CellView {...args} />
  </div>
);

export const Default = Story.bind({});

export const Selected = Story.bind({});
Selected.args = {
  itemsSelectedId: ["image_1", "image_2"],
};

export const WithDiffenrentType = Story.bind({});
WithDiffenrentType.args = {
  items: itemsDifferent,
  cellHeight: cellHeightDifferent,
};

export const WithHeaders = Story.bind({});
WithHeaders.args = {
  items: itemsDifferent,
  cellHeight: cellHeightDifferent,
  headers,
};
