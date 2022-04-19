import * as React from "react";
import FieldText from "../Field/FieldText/FieldText";
import TypographyEllipsis from ".";

const longlabel =
  "Lorem ipsum dolor sit amet " +
  "Lorem ipsum dolor sit amet " +
  "Lorem ipsum dolor sit amet " +
  "Lorem ipsum dolor sit amet " +
  "Lorem ipsum dolor sit amet " +
  "Lorem ipsum dolor sit amet " +
  "Lorem ipsum dolor sit amet " +
  "Lorem ipsum dolor sit amet " +
  "Lorem ipsum dolor sit amet ";

const DemoTypographyEllipsis = () => {
  const [value, setValue] = React.useState(longlabel);
  const onCbChange = React.useCallback((newValue) => {
    setValue(newValue);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        padding: "10px 50px",
      }}
    >
      <FieldText value={value} onChange={onCbChange} />
      <TypographyEllipsis children={value} endLength={20} />
    </div>
  );
};

export default {
  title: "Components/TypographyEllipsis",
  component: TypographyEllipsis,
  args: {
    children: "TypographyEllipsis",
  },
};

const Story = (args) => <TypographyEllipsis {...args} />;
export const Default = Story.bind({});

const DemoStory = () => <DemoTypographyEllipsis />;
export const Demo = DemoStory.bind({});

export const Ellipsissed = Story.bind({});
Ellipsissed.args = {
  children: longlabel,
};

export const EndLength = Story.bind({});
EndLength.args = {
  children: longlabel,
  endLength: 20,
};
