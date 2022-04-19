import setTheme from "../src/componentsBase/__stories__/setTheme";
import * as React from "react";
export const decorators = [(Story) => setTheme(<Story />)];
export const parameters = {
  options: {
    storySort: {
      order: ["Intro", "Components"],
      method: "alphabetical",
    },
  },
};
