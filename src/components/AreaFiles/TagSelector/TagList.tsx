import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import LoadingMask from "../../../componentsBase/LoadingMask";
import * as Colors from "../../../componentsBase/style/Colors";
import sortByKey from "../../../utils/sortByKey";
import { IFileDetail, ITag, Severity, TagType } from "../../../interfaces";
import TagItem from "./TagItem";
import { TYPE_FOLDER } from "../../../constants";
import {
  addTag,
  removeTag,
  addTagToFilesFolders,
  removeTagFromFileFolder,
} from "../../../api/fetchesApi";
import isEmpty from "lodash-es/isEmpty";
import findTag from "./findTag";
import { ContextSetSnackbar } from "../../contexts";
import { errorSomethingWrong } from "../constants";

const sortTags = (tags: ITag[]) => {
  const sort = [TagType.MARKETING, TagType.PRODUCT, TagType.SIMPLE];
  return sort.reduce((acc, type: TagType) => {
    const tagGroup = tags.filter((t: ITag) => t.type === type);
    const tagGroupSorted = sortByKey(tagGroup, "name");
    return [].concat(acc, tagGroupSorted);
  }, []);
};

const useStyles = makeStyles({
  list: {
    position: "relative",
    padding: "15px 0 20px 0",
  },
  typo: {
    display: "flex",
    "flex-direction": "row",
  },
  typoLabel: {
    "margin-top": 10,
    color: Colors.Gray2,
  },
  flex1: {
    flex: 1,
  },
});

interface ITypo {
  variant?: "light" | "bold";
  label: string;
}
const Typo = ({ variant = "light", label }: ITypo) => {
  const classes = useStyles({});
  return (
    <div className={classes.typo}>
      <div className={classes.flex1} />
      <Typography
        className={classes.typoLabel}
        variant={variant === "light" ? "body1" : "body2"}
        children={label}
      />
      <div className={classes.flex1} />
    </div>
  );
};

interface ITagList {
  files: IFileDetail[];
  searchedInput: string;
  searchedTags: ITag[];
  searchedTagsTotal: number;
  readOnly: boolean;
  onChange: (files: IFileDetail[]) => void;
}

const TagList = ({
  files,
  searchedInput,
  searchedTags,
  searchedTagsTotal,
  readOnly,
  onChange,
}: ITagList) => {
  const classes = useStyles({});
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const [tagToAdd, setTagToAdd] = React.useState(null as ITag);
  const [tagToRemove, setTagToRemove] = React.useState(null as ITag);
  const filesTag = sortTags(
    files.reduce((acc, { tags }) => {
      (tags || []).forEach((t) => {
        const tagFound = findTag(acc, t.name, t.type);
        if (!tagFound) acc.push(t);
      });
      return acc;
    }, [])
  );
  const searchTagsSorted = sortTags(searchedTags);
  const countTagsHidden = searchedTagsTotal - searchedTags.length;
  const onTagAdd = React.useCallback((tag) => {
    setTagToAdd(tag);
  }, []);
  const onTagRemove = React.useCallback((tag) => {
    setTagToRemove(tag);
  }, []);
  const filesTagMatched = filesTag.filter((t: ITag) => {
    return t.name.includes(searchedInput);
  });
  const searchedActive = !!searchedInput;
  const tagsCanBeAdded = (searchedActive ? searchTagsSorted : []).filter(
    (t: ITag) => {
      return !findTag(filesTagMatched, t.name, t.type);
    }
  );

  // manage ADD tag
  React.useEffect(() => {
    (async () => {
      if (!!tagToAdd) {
        const payload = [];

        try {
          if (files.length === 1) {
            const owner = files[0];
            const newItems = await addTag({
              ...tagToAdd,
              ownerId: owner.id,
              ownerIsFolder: owner.mimeType === TYPE_FOLDER,
            });
            newItems.forEach((a) => payload.push(a));
          } else {
            const fileIds = files
              .filter((f) => f.mimeType === TYPE_FOLDER)
              .map((f) => f.id);
            const folderIds = files
              .filter((f) => f.mimeType !== TYPE_FOLDER)
              .map((f) => f.id);
            const newItems = await addTagToFilesFolders({
              ...tagToAdd,
              fileIds,
              folderIds,
            });
            newItems.forEach((a) => payload.push(a));
          }
        } catch {
          setSnackbar(Severity.WARNING, errorSomethingWrong);
        }

        setTagToAdd(null);
        onChange(payload);
      }
    })();
  }, [files, onChange, setSnackbar, tagToAdd]);

  // manage REMOVE tag
  React.useEffect(() => {
    (async () => {
      if (!!tagToRemove) {
        const payload = [];

        try {
          if (files.length === 1) {
            const newItems = await removeTag({
              id: tagToRemove.id,
              type: tagToRemove.type,
            });
            newItems.forEach((a) => payload.push(a));
          } else {
            const ids = files.reduce((acc, { tags }) => {
              const { name, type } = tagToRemove;
              const tagToRemoveId = findTag(tags, name, type).id;
              acc.push(tagToRemoveId);
              return acc;
            }, []);
            const newItems = await removeTagFromFileFolder(ids);
            newItems.forEach((a) => payload.push(a));
          }
        } catch {
          setSnackbar(Severity.WARNING, errorSomethingWrong);
        }

        setTagToRemove(null);
        onChange(payload);
      }
    })();
  }, [files, onChange, setSnackbar, tagToRemove]);

  return (
    <div className={classes.list}>
      <LoadingMask open={!!tagToAdd || !!tagToRemove} />
      {(searchedActive ? filesTagMatched : filesTag).map((t: ITag) => {
        const countOwned = files.reduce((acc, { tags }) => {
          if (!!findTag(tags, t.name, t.type)) acc = acc + 1;
          return acc;
        }, 0);
        const isAllOwned = countOwned === files.length;
        return (
          <TagItem
            key={t.id}
            {...t}
            icon={isAllOwned ? "cancel" : "add_box"}
            tooltip={
              isAllOwned ? (
                files.length > 1 ? (
                  "Remove tag from all selected files"
                ) : (
                  "Remove tag"
                )
              ) : (
                <>
                  <Typography
                    style={{ color: "#fff" }}
                    variant="body1"
                    children={`${countOwned}/${files.length} files have this tag`}
                  />
                  <Typography
                    style={{ color: "#fff" }}
                    variant="body1"
                    children="Add tag from all selected files"
                  />
                </>
              )
            }
            selected
            onClick={isAllOwned ? onTagRemove : onTagAdd}
            readOnly={readOnly}
          />
        );
      })}
      {tagsCanBeAdded.map((t: ITag) => {
        const multiTag = files.length > 1;
        return (
          <TagItem
            key={t.id}
            {...t}
            icon="add_box"
            tooltip={!multiTag ? "Add tag" : "Add tag from all selected files"}
            onClick={onTagAdd}
          />
        );
      })}
      {!countTagsHidden ? null : (
        <Typo
          label={`${countTagsHidden} more results, please refine your search`}
        />
      )}
      {!(searchedActive && !searchedTagsTotal) ||
      !isEmpty(filesTagMatched) ? null : (
        <Typo label={"No results found"} />
      )}
      {!(!searchedActive && isEmpty(filesTag)) ? null : (
        <Typo
          label={`There are no tags applied to this ${
            files.length === 1 ? "asset" : "selection"
          }`}
        />
      )}
    </div>
  );
};

export default TagList;
