import * as React from "react";

import { FormControl, MenuItem, Select, Typography } from "@material-ui/core";

const TitleWithSelectField = ({
  title,
  value,
  handleChange,
  disabled = false,
  options,
}: {
  title: string;
  value: string;
  disabled?: boolean;
  handleChange?: (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>,
    child: React.ReactNode
  ) => void;
  options: { value: string; label: string }[];
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 10,
        width: 100,
      }}
    >
      <Typography variant="body2">{title.toUpperCase()}</Typography>
      <FormControl>
        <Select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {options.map(({ value, label }, index) => (
            <MenuItem key={index} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TitleWithSelectField;
