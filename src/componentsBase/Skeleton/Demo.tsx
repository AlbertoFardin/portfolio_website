import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Skeleton from "./Skeleton";

const SkeletonDemo = () => {
  const [animation, setAnimation] = React.useState("pulse" as "pulse" | "wave");
  const onAnimation = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAnimation(event.target.value as "pulse" | "wave");
    },
    []
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1 }} />
      <Skeleton height={200} width={200} animation={animation} />
      <TextField
        style={{ width: 250, margin: 10 }}
        label="animation (pulse, wave)"
        value={animation}
        onChange={onAnimation}
      />
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default SkeletonDemo;
