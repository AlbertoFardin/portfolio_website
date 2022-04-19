/* eslint-disable @typescript-eslint/no-explicit-any */
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import Btn from "../Btn";
import DemoColorToolbar from "../__stories__/DemoColorToolbar";
import PaperFold from "./";

class BtnDemo extends React.Component<any, { [key: string]: any }> {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      anchorHorizontal: "left",
      anchorVertical: "top",
      size: 15,
    };
  }

  public setColor = (v) => {
    this.setState({ color: v });
  };
  public setSize = (event) => {
    this.setState({ size: Number(event.target.value) });
  };
  public setAnchorHorizontal = (event) => {
    this.setState({ anchorHorizontal: event.target.value });
  };
  public setAnchorVertical = (event) => {
    this.setState({ anchorVertical: event.target.value });
  };

  public getConfigBox = () => {
    const { open, anchorHorizontal, anchorVertical } = this.state;
    return (
      <Paper style={{ width: 300, margin: 20, overflow: "hidden" }}>
        <div
          style={{
            padding: 20,
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
          }}
        >
          <Btn
            {...{
              color: "#00f",
              icon: open ? "check_box" : "check_box_outline_blank",
              label: "OPEN",
              onClick: () => {
                this.setState({ open: !open });
              },
            }}
          />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">anchorHorizontal</FormLabel>
              <RadioGroup
                value={anchorHorizontal}
                onChange={this.setAnchorHorizontal}
              >
                <FormControlLabel
                  value="left"
                  control={<Radio />}
                  label="left"
                />
                <FormControlLabel
                  value="right"
                  control={<Radio />}
                  label="right"
                />
              </RadioGroup>
            </FormControl>
            <div style={{ flex: 1 }} />
            <FormControl component="fieldset">
              <FormLabel component="legend">anchorVertical</FormLabel>
              <RadioGroup
                value={anchorVertical}
                onChange={this.setAnchorVertical}
              >
                <FormControlLabel value="top" control={<Radio />} label="top" />
                <FormControlLabel
                  value="bottom"
                  control={<Radio />}
                  label="bottom"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <TextField
            label="size"
            value={String(this.state.size)}
            type="number"
            onChange={this.setSize}
          />
        </div>
      </Paper>
    );
  };

  public render() {
    return (
      <div
        style={{
          height: "100%",
          overflow: "auto",
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <DemoColorToolbar onChange={this.setColor} zIndex={0} />

        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                flex: 1,
              }}
            >
              <div
                style={{
                  border: "1px solid #000",
                  borderRadius: this.state.size,
                  position: "relative",
                  background: "#ccf",
                  width: 120,
                  height: 120,
                }}
              >
                <PaperFold {...this.state} />
              </div>
            </div>
          </div>

          {this.getConfigBox()}
        </div>
      </div>
    );
  }
}

export default BtnDemo;
