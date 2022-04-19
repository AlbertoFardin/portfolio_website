import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Input from "@material-ui/core/Input";
import Btn from "../../../componentsBase/Btn";
import { searchDiz } from "../../../api/fetchesApi";
import { colorTheme } from "../../../constants";
import BtnCreateTag from "./BtnCreateTag";
import { IFileDetail, ITag, TagType } from "../../../interfaces";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ACT_FIELD } from "./reducer";
import { ACT_VPORT } from "../reducer";
import { ContextDispatchViewport } from "../contexts";

const useStyles = makeStyles({
  search: {
    position: "relative",
    width: "100%",
    border: "1px solid #ddd",
    "border-radius": 5,
    display: "flex",
    "align-items": "center",
    "box-sizing": "border-box",
    height: 40,
  },
  input: {
    height: 26,
    "font-weight": "lighter",
    width: "100%",
    "& input": {
      padding: 0,
      "font-size": 12,
      width: "100%",
      "&::placeholder": {
        "font-style": "italic",
      },
    },
    "&::before": {
      display: "none",
    },
    "&::after": {
      display: "none",
    },
  },
  iconBox: {
    "min-width": 40,
    height: "100%",
    display: "flex",
    "align-items": "center",
  },
  spinner: {
    color: colorTheme,
    margin: "auto",
  },
  flex1: {
    flex: 1,
  },
});

interface ISearchInput {
  dispatchSelector: React.Dispatch<unknown>;
  files: IFileDetail[];
  tagManagement: boolean;
  searchLoading: boolean;
  searchedInput: string;
  searchedTags: ITag[];
  onChange: (files: IFileDetail[]) => void;
}

const SearchInput = ({
  dispatchSelector,
  files,
  tagManagement,
  searchLoading,
  searchedInput,
  searchedTags,
  onChange,
}: ISearchInput) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const classes = useStyles({});
  const inputRef = React.useRef(null);
  const cbOnClear = React.useCallback(() => {
    inputRef.current.value = "";
    dispatchSelector({ type: ACT_FIELD.RESET });
  }, [dispatchSelector]);
  const cbOnChange = React.useCallback(
    (event) => {
      const input = event.target.value;
      if (input === "") {
        dispatchSelector({ type: ACT_FIELD.RESET });
      } else {
        dispatchSelector({ type: ACT_FIELD.SEARCH_CHANGE, input });
      }
    },
    [dispatchSelector]
  );
  const cbOnTagManagement = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.TAG_MANAGEMENT });
  }, [dispatchViewport]);
  const stringfyIds = files.map(({ id }) => id).join();
  const canCreateTagS = !searchedTags.find(
    (t) => t.name === searchedInput && t.type === TagType.SIMPLE
  );
  const canCreateTagM = !searchedTags.find(
    (t) => t.name === searchedInput && t.type === TagType.MARKETING
  );

  React.useEffect(() => {
    if (stringfyIds) cbOnClear();
  }, [stringfyIds, cbOnClear]);

  // search tags and enable btn to create new tag
  React.useEffect(() => {
    if (searchedInput) {
      (async () => {
        const {
          items,
          total,
        }: { items: ITag[]; total: number } = await searchDiz({
          searchName: searchedInput,
        });

        dispatchSelector({
          type: ACT_FIELD.SEARCH_RESULT,
          searchedTags: items,
          searchedTagsTotal: total,
        });
      })();
    }
  }, [dispatchSelector, searchedInput]);

  return (
    <div className={classes.search}>
      <div className={classes.iconBox}>
        <div className={classes.flex1} />
        {searchLoading ? (
          <CircularProgress size={20} className={classes.spinner} />
        ) : !!searchedInput ? (
          <Btn color={colorTheme} icon="clear" onClick={cbOnClear} />
        ) : tagManagement ? (
          <Btn
            color={colorTheme}
            icon="local_offer"
            tooltip="Open Tag Management"
            onClick={cbOnTagManagement}
          />
        ) : (
          <Btn color={colorTheme} icon="search" />
        )}
        <div className={classes.flex1} />
      </div>
      <Input
        inputRef={inputRef}
        className={classes.input}
        placeholder="Search or create tag..."
        onChange={cbOnChange}
      />
      {!canCreateTagM ? null : (
        <BtnCreateTag
          files={files}
          label="Create a new Marketing Tag"
          tagType={TagType.MARKETING}
          tagName={searchedInput}
          onChange={onChange}
        />
      )}
      {!canCreateTagS ? null : (
        <BtnCreateTag
          files={files}
          label="Create a new Simple Tag"
          tagType={TagType.SIMPLE}
          tagName={searchedInput}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default SearchInput;
