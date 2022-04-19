import * as React from "react";
import { action } from "@storybook/addon-actions";
import Btn from ".";
import * as Colors from "../style/Colors";
import DemoBtn from "./Demo";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

export default {
  title: "Components/Btn",
  component: Btn,
  argTypes: {
    color: { control: "color" },
  },
  args: {
    icon: "photo_camera",
    label: "Camera",
    onClick: action("onClick"),
  },
};

const Story = (args) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>VARIANT</TableCell>
          <TableCell>default</TableCell>
          <TableCell>mousehover</TableCell>
          <TableCell>disabled</TableCell>
          <TableCell>custom color</TableCell>
          <TableCell>custom color + mousehover</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {["light", "bold"].map((v) => (
          <TableRow key={v}>
            <TableCell>
              <Typography style={{ fontStyle: "italic" }} children={v} />
            </TableCell>
            <TableCell>
              <Btn {...args} variant={v} />
            </TableCell>
            <TableCell>
              <Btn {...args} variant={v} selected />
            </TableCell>
            <TableCell>
              <Btn {...args} variant={v} disabled />
            </TableCell>
            <TableCell>
              <Btn {...args} variant={v} color={Colors.Green} />
            </TableCell>
            <TableCell>
              <Btn {...args} variant={v} color={Colors.Green} selected />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export const Default = Story.bind({});

const DemoStory = () => <DemoBtn />;
export const Demo = DemoStory.bind({});
