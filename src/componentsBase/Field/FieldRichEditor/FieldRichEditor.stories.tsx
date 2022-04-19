import * as React from "react";
import FieldRichEditor from "./FieldRichEditor";
import { action } from "@storybook/addon-actions";
import DemoFieldRichEditor from "./Demo";
import { style } from "../utils/story";

export default {
  title: "Components/Fields/FieldRichEditor",
  component: FieldRichEditor,
  args: {
    label: "FieldRichEditor",
    onChange: action("onChange"),
    onBlur: action("onBlur"),
    onFocus: action("onFocus"),
    style,
    toolbarPosition: "right",
    value:
      "<p><strong>Lorem ipsum dolor</strong> <em>sit amet, consectetur adipiscing elit.</em>&nbsp;</p><ul><li>Vivamus accumsan lectus ut libero vulputate.</li></ul><p>Elementum felis aliquet. Fusce non tincidunt turpis, sit amet tincidunt magna. Nulla nec aliquam diam, eget gravida nisi. Nulla facilisis, dui lacinia sodales tristique, tellus magna bibendum enim, a tincidunt justo urna sit amet leo. Nulla facilisis nibh nec purus tempor, eu rutrum purus convallis. In sollicitudin velit urna, vitae iaculis justo fermentum in. Nam finibus augue nec elit varius, quis ultricies felis suscipit. Integer ac gravida risus. Sed vel urna vel mauris pellentesque interdum.</p><p>Elementum felis aliquet. Fusce non tincidunt turpis, sit amet tincidunt magna. Nulla nec aliquam diam, eget gravida nisi. Nulla facilisis, dui lacinia sodales tristique, tellus magna bibendum enim, a tincidunt justo urna sit amet leo. Nulla facilisis nibh nec purus tempor, eu rutrum purus convallis. In sollicitudin velit urna, vitae iaculis justo fermentum in. Nam finibus augue nec elit varius, quis ultricies felis suscipit. Integer ac gravida risus. Sed vel urna vel mauris pellentesque interdum.</p>",
  },
};

const Story = (args) => <FieldRichEditor {...args} />;
export const Default = Story.bind({});

const DemoStory = () => <DemoFieldRichEditor />;
export const Demo = DemoStory.bind({});
