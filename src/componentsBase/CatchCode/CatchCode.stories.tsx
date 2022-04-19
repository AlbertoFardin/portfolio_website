import * as React from "react";
import { action } from "@storybook/addon-actions";
import CatchCode from "./CatchCode";
import Typography from "@material-ui/core/Typography";

export default {
  title: "Components/CatchCode",
  component: CatchCode,
};

const Story = ({ toCatch }) => {
  const [special, setSpecial] = React.useState(false);
  const onCatch = React.useCallback(() => {
    action("onCode")();
    console.log("=> onCode!");
    setSpecial(true);
  }, []);

  return (
    <CatchCode listeners={[{ toCatch, onCatch }]}>
      <Typography
        style={special ? { background: "red" } : {}}
        children={
          special
            ? `🥳 you texted: '${toCatch}'`
            : `🤔 Try to text: '${toCatch}'`
        }
      />
    </CatchCode>
  );
};

export const CodeWarda = Story.bind({});
CodeWarda.args = {
  toCatch: "WARDA",
};

export const CodeKonami = Story.bind({});
CodeKonami.args = {
  toCatch: "↑↑↓↓←→←→ba",
};

const colors = ["red", "blue", "yellow", "green"];
const StoryColors = () => {
  const [typeColor, setTypeColor] = React.useState("");
  const listeners = React.useMemo(() => {
    return colors.map((c) => ({
      toCatch: c,
      onCatch: () => setTypeColor(c),
    }));
  }, []);

  return (
    <CatchCode listeners={listeners}>
      <Typography
        style={{ backgroundColor: typeColor }}
        children={`Try to text one of these colors: ${String(colors)}`}
      />
    </CatchCode>
  );
};
export const CodeColors = StoryColors.bind({});
