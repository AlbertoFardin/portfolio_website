import * as React from "react";
import { action } from "@storybook/addon-actions";
import {
  urlImage,
  urlImage2,
  urlImage3,
  urlImage4,
} from "../../__stories__/mediaUrls";
import IUser from "../../IUser";
import FieldMentions from "./FieldMentions";
import { Paper, BtnCheck, style } from "../utils/story";

const InputMonospace = ({ value }: { value: string }) => (
  <div
    style={{
      minHeight: 15,
      border: "1px solid",
      padding: 10,
      background: "#f1f1f1",
      fontFamily: "monospace",
      width: "-webkit-fill-available",
    }}
    children={JSON.stringify(value)}
  />
);
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

const DemoMentionsInput = () => {
  const [value, setValue] = React.useState("");
  const [readOnly, setReadOnly] = React.useState(false);
  const onChange = React.useCallback((newValue, mentions) => {
    console.log("--", newValue);
    setValue(newValue);
    action("onChange")(newValue, mentions);
  }, []);
  const onReadOnly = React.useCallback(() => setReadOnly(!readOnly), [
    readOnly,
  ]);

  return (
    <>
      <FieldMentions
        label="FieldMentions"
        value={value}
        onChange={onChange}
        users={users}
        readOnly={readOnly}
        style={style}
      />
      <Paper>
        <InputMonospace value={value} />
        <BtnCheck check={readOnly} label="readOnly" onClick={onReadOnly} />
      </Paper>
    </>
  );
};

export default DemoMentionsInput;
