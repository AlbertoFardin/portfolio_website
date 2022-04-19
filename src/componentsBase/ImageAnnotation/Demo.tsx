import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { action } from "@storybook/addon-actions";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import Btn from "../Btn";
import annotationsStart from "../__stories__/mock/ImageAnnotation";
import {
  urlImage,
  urlImage2,
  urlImage3,
  urlImage4,
} from "../__stories__/mediaUrls";
import IUser from "../IUser";
import ImageAnnotation, {
  FreehandSelector,
  IAnnotation,
  OvalSelector,
  PointSelector,
  RectangleSelector,
} from ".";

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
const COLORS = [
  "#9A26ED",
  "#1EC8A0",
  "#F2D822",
  "#ED3A69",
  "#002BFF",
  "#1A1A1A",
];
const getRadio = (value: string, disable = false) => (
  <FormControlLabel
    control={<Radio />}
    value={value}
    label={value}
    disabled={disable}
  />
);
const colorTheme = "#00f";

const ImageAnnotationDemo = () => {
  const myUserId = users[0].id;
  const [selector, setSelector] = React.useState(PointSelector.TYPE);
  const [readOnly, setReadOnly] = React.useState(false);
  const [colorsEnabled, setColorsEnabled] = React.useState(true);
  const [colors, setColors] = React.useState(COLORS as string[]);
  const [annotations, setAnnotations] = React.useState(
    annotationsStart as IAnnotation[]
  );
  const [loading, setLoading] = React.useState(false);
  const [resolvable, setResolvable] = React.useState(true);
  const annotationsMod = annotations.map((a: IAnnotation) => {
    // can edit only my annotation
    const itIsMe = a.user.id === myUserId;
    return {
      ...a,
      editable: {
        color: true,
        resolved: resolvable,
        value: itIsMe,
        delete: itIsMe,
      },
    };
  });
  const onAnnotationChange = (
    actionLabel: string,
    ann: IAnnotation,
    anns: IAnnotation[]
  ) => {
    const fixArrayForDemo = anns.map((a: IAnnotation) => {
      const aId = a.data.id;
      return aId
        ? a
        : {
            ...a,
            data: {
              ...a.data,
              id: uuidv4(),
            },
          };
    });
    setAnnotations(fixArrayForDemo);
    action(actionLabel)(ann, anns);
  };
  const onSelectorChange = React.useCallback(
    (event, value) => setSelector(value),
    []
  );

  return (
    <div
      style={{
        padding: 25,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1 }} />
      <ImageAnnotation
        {...{
          colorTheme,
          annotations: annotationsMod,
          annotationEditable: {
            color: true,
            resolved: true,
            value: true,
            delete: true,
          },
          loading,
          colors,
          colorsEnabled,
          readOnly,
          imageUrl: urlImage,
          imageWidth: 450,
          imageHeight: 300,
          selector,
          users,
          userId: myUserId,
          onCreate: (changed, newArray) =>
            onAnnotationChange("onCreate", changed, newArray),
          onDelete: (changed, newArray) =>
            onAnnotationChange("onDelete", changed, newArray),
          onEdit: (changed, newArray) =>
            onAnnotationChange("onEdit", changed, newArray),
        }}
      />
      <div style={{ flex: 1 }} />
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          padding: 20,
        }}
      >
        <Btn
          {...{
            color: colorTheme,
            onClick: () => setReadOnly(!readOnly),
            style: { borderWidth: 0, margin: 0 },
            leftIcon: readOnly ? "check_box" : "check_box_outline_blank",
            label: "ReadOnly",
          }}
        />
        <Btn
          {...{
            color: colorTheme,
            onClick: () => setColors(colors.length > 1 ? [COLORS[0]] : COLORS),
            style: { borderWidth: 0, margin: 0 },
            leftIcon:
              colors.length > 1 ? "check_box" : "check_box_outline_blank",
            label: "Colors",
          }}
        />
        <Btn
          {...{
            color: colorTheme,
            onClick: () => setColorsEnabled(!colorsEnabled),
            style: { borderWidth: 0, margin: 0 },
            leftIcon: colorsEnabled ? "check_box" : "check_box_outline_blank",
            label: "ColorsEnabled",
          }}
        />
        <Btn
          {...{
            color: colorTheme,
            onClick: () => setLoading(!loading),
            style: { borderWidth: 0, margin: 0 },
            leftIcon: loading ? "check_box" : "check_box_outline_blank",
            label: "Loading",
          }}
        />
        <Btn
          {...{
            color: colorTheme,
            onClick: () => setResolvable(!resolvable),
            style: { borderWidth: 0, margin: 0 },
            leftIcon: resolvable ? "check_box" : "check_box_outline_blank",
            label: "Resolvable",
          }}
        />
        <Divider style={{ margin: "10px 0 20px 0", width: "100%" }} />
        <FormControl>
          <FormLabel children="Annotation Selector:" />
          <RadioGroup value={selector} onChange={onSelectorChange}>
            {getRadio(PointSelector.TYPE)}
            {getRadio(FreehandSelector.TYPE)}
            {getRadio(RectangleSelector.TYPE, true)}
            {getRadio(OvalSelector.TYPE, true)}
          </RadioGroup>
        </FormControl>
      </Paper>
    </div>
  );
};

export default ImageAnnotationDemo;
