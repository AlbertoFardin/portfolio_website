import { action } from "@storybook/addon-actions";
import * as React from "react";
import {
  urlImage,
  urlImage2,
  urlImage3,
  urlImage4,
} from "../../__stories__/mediaUrls";
import IUser from "../../IUser";
import DemoFieldMentions from "./Demo";
import FieldMentions from "./FieldMentions";
import { style } from "../utils/story";

const users = [
  {
    id: "_id1",
    picture: urlImage,
    firstName: "Laura",
    lastName: "Rossi",
  },
  {
    id: "_id2",
    picture: urlImage2,
    firstName: "Marta",
    lastName: "Draghi",
  },
  {
    id: "_id3",
    picture: urlImage3,
    firstName: "Elisa",
    lastName: "Tommasi",
  },
  {
    id: "_id4",
    picture: urlImage4,
    firstName: "Genoveffa",
    lastName: "Strudel",
  },
] as IUser[];

export default {
  title: "Components/Fields/FieldMentions",
  component: FieldMentions,
  args: {
    label: "FieldMentions",
    onChange: action("onChange"),
    style,
    users,
    value:
      "Hi @[Laura Rossi](id:_id1)  👋 Do you see @[Elisa Tommasi](id:_id3) ?",
  },
};

const Story = (args) => <FieldMentions {...args} />;
export const Default = Story.bind({});

const DemoStory = () => <DemoFieldMentions />;
export const Demo = DemoStory.bind({});
