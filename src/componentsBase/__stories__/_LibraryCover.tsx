import Typography from "@material-ui/core/Typography";
import * as React from "react";
import LogoWarda from "../LogoWarda";
import setTheme from "./setTheme";
import * as Colors from "../style/Colors";

export default {
  name: "LIBRARY-UI",
  stories: [
    {
      name: "welcome",
      fn: () =>
        setTheme(
          <div
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
              backgroundColor: Colors.Blue,
            }}
          >
            <div
              style={{
                width: 250,
                height: 90,
                textAlign: "center",
                margin: "auto",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <LogoWarda height={90} width={200} color="#ffffff" />
              <Typography
                style={{
                  color: "#ffffff",
                  fontWeight: "lighter",
                  letterSpacing: 3,
                }}
                children={"LIBRARY-UI"}
              />
            </div>
          </div>
        ),
    },
  ],
};
