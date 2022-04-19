import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import {
  Label,
  ILabelPositionX,
  ILabelPositionY,
} from "../../../componentsBase/Field";
import { IFileDetail } from "../../../interfaces";
import ListTags from "./TagList";
import SearchInput from "./SearchInput";
import classnames from "classnames";
import makeStyles from "@material-ui/core/styles/makeStyles";
import reducer, { reducerInitState } from "./reducer";
import { emptyFn } from "../../../componentsBase/utils/common";
import TagSelectorReadOnly from "./TagSelectorReadOnly";

const useStyles = makeStyles({
  tagSelector: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
});

interface ITagSelector {
  className?: string;
  files: IFileDetail[];
  tagManagement?: boolean;
  readOnly?: boolean;
  label?: string;
  onChange?: (files: IFileDetail[]) => void;
}

const TagSelector = ({
  className,
  files,
  tagManagement = true,
  readOnly: readOnlyInit,
  label,
  onChange = emptyFn,
}: ITagSelector) => {
  const classes = useStyles({});
  const [stateSelector, dispatchSelector] = React.useReducer(
    reducer,
    reducerInitState
  );
  const {
    searchLoading,
    searchedInput,
    searchedTags,
    searchedTagsTotal,
  } = stateSelector;
  const cannotEditData = !!files.find(({ canEdit }) => !canEdit);
  const readOnly = readOnlyInit || cannotEditData;

  return (
    <div
      className={classnames({
        [classes.tagSelector]: true,
        [className]: !!className,
      })}
    >
      {readOnly ? (
        <TagSelectorReadOnly label={label} files={files} />
      ) : (
        <>
          <Toolbar style={{ padding: 0 }}>
            {!label ? null : (
              <Label
                id="label"
                label={label}
                positionX={ILabelPositionX.left}
                positionY={ILabelPositionY.top}
                readOnly
                style={{ top: "-15px" }}
              />
            )}
            <SearchInput
              dispatchSelector={dispatchSelector}
              files={files}
              tagManagement={tagManagement}
              searchLoading={searchLoading}
              searchedInput={searchedInput}
              searchedTags={searchedTags}
              onChange={onChange}
            />
          </Toolbar>
          <ListTags
            files={files}
            searchedInput={searchedInput}
            searchedTags={searchedTags}
            searchedTagsTotal={searchedTagsTotal}
            readOnly={readOnly}
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
};

export default TagSelector;
