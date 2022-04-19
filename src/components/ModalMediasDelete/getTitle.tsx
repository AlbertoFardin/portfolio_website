import * as React from "react";

const getTitle = (
  mediaToDelete: { filename: string }[]
): string | JSX.Element => {
  if (mediaToDelete.length === 1) {
    return (
      <>
        <span children="You are deleting" />
        <span
          children={` "${mediaToDelete[0].filename}".`}
          style={{ fontStyle: "italic" }}
        />
      </>
    );
  }
  if (mediaToDelete.length > 1) {
    return `You are deleting ${mediaToDelete.length} medias`;
  }
  return "Delete";
};

export default getTitle;
