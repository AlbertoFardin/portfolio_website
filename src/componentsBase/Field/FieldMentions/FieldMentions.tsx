import * as React from "react";
import { MentionsInput } from "react-mentions";
import classnames from "classnames";
import { getLabels } from "../Label";
import ListItem from "../../ListItem";
import IFieldMentions from "./IFieldMentions";
import useStyles, { suggestionsStyle } from "./useStyles";
import { emptyFn } from "../../utils/common";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Mention = ({ display, className }: any) => (
  <span className={className} children={display} />
);
const displayTransform = (id, display) => display;

const FieldMentions = ({
  autoFocus,
  className,
  style,
  label = "",
  onChange = emptyFn,
  placeholder = "Write...",
  readOnly = false,
  users: usersInit,
  value,
}: IFieldMentions) => {
  const inputRef = React.useRef(null);
  const classes = useStyles({ readOnly });
  const users = usersInit.map(({ id, firstName, lastName }) => ({
    id,
    display: `${firstName} ${lastName}`,
  }));
  const cbOnChange = React.useCallback(
    (event, newValue, newPlainTextValue, mentions) => {
      if (!readOnly) {
        const mentionsCompleted = mentions.map(({ id }) =>
          usersInit.find((u) => u.id === id)
        );
        onChange(newValue, mentionsCompleted);
      }
    },
    [onChange, usersInit, readOnly]
  );
  const cbRenderSuggestion = React.useCallback(
    (suggestion, search, highlightedDisplay, index, focused) => {
      const { id, picture } = usersInit.find(({ id }) => id === suggestion.id);
      return (
        <ListItem
          id={id}
          avatar={picture}
          label={highlightedDisplay}
          hover={focused}
          onClickStopPropagation={false}
        />
      );
    },
    [usersInit]
  );

  React.useEffect(() => {
    inputRef.current.readOnly = readOnly;
  }, [readOnly]);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  return (
    <div
      className={classnames({
        [classes.fieldMentions]: true,
        [className]: !!className,
      })}
      style={style}
    >
      {getLabels(label, readOnly)}
      <MentionsInput
        inputRef={inputRef}
        value={value}
        onChange={cbOnChange}
        className={classes.mentionsInput}
        placeholder={placeholder}
        style={{ suggestions: suggestionsStyle }}
      >
        <Mention
          markup="@[__display__](id:__id__)"
          trigger="@"
          data={users}
          renderSuggestion={cbRenderSuggestion}
          displayTransform={displayTransform}
          className={classes.mentionsUser}
        />
      </MentionsInput>
    </div>
  );
};

export default FieldMentions;
