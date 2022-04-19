import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ACT_MODAL } from "./reducer";
import TagItem from "../TagSelector/TagItem";
import { ITag } from "../../../interfaces";
import Btn from "../../../componentsBase/Btn";
import List from "@material-ui/core/List";
import * as Colors from "../../../componentsBase/style/Colors";
import hexToRgbA from "../../../componentsBase/utils/hexToRgbA";
import LoadingMask from "../../../componentsBase/LoadingMask";
import Placeholder from "../../../componentsBase/Placeholder";
import findTag from "../TagSelector/findTag";
import isEmpty from "lodash-es/isEmpty";

interface IStyles {
  mousehover: boolean;
  selected: boolean;
}
const useStyles = makeStyles({
  listitem: {
    padding: "1px 0",
    margin: "1px 0",
    "border-radius": 5,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    transition: "all 250ms",
    "background-color": ({ mousehover, selected }: IStyles) => {
      if (selected) return hexToRgbA(Colors.Purple, 0.15);
      if (mousehover) return Colors.Gray4;
      return "#fff";
    },
  },
  tag: {
    margin: 0,
  },
  flex1: {
    flex: 1,
  },
});

interface IListItem {
  dispatchCmp: React.Dispatch<unknown>;
  selected: boolean;
  selectable: boolean;
  tag: ITag;
}

const ListItem = ({ dispatchCmp, selected, selectable, tag }: IListItem) => {
  const [mousehover, setMousehover] = React.useState(false);
  const classes = useStyles({
    mousehover,
    selected,
  });
  const onSelect = React.useCallback(() => {
    dispatchCmp({
      type: ACT_MODAL.TAG_SELECT,
      tag,
    });
  }, [dispatchCmp, tag]);
  const onMouseEnter = React.useCallback(() => {
    setMousehover(true);
  }, []);
  const onMouseLeave = React.useCallback(() => {
    setMousehover(false);
  }, []);

  return (
    <div
      className={classes.listitem}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!selectable ? null : (
        <Btn
          icon={selected ? "check_box" : "check_box_outline_blank"}
          iconStyle={{ color: selected ? Colors.Purple : undefined }}
          onClick={onSelect}
        />
      )}
      <TagItem {...tag} selected className={classes.tag} />
      <div className={classes.flex1} />
    </div>
  );
};

interface IContent {
  dispatchModal: React.Dispatch<unknown>;
  foundTags: ITag[];
  searchingTags: boolean;
  selectedTags: ITag[];
  canEdit: boolean;
}
const Content = ({
  dispatchModal,
  foundTags,
  searchingTags,
  selectedTags,
  canEdit,
}: IContent) => (
  <List style={{ overflow: "overlay", maxHeight: 390, minHeight: 150 }}>
    <LoadingMask open={searchingTags} />
    {foundTags.map((t: ITag) => (
      <ListItem
        key={t.id}
        dispatchCmp={dispatchModal}
        tag={t}
        selected={!!findTag(selectedTags, t.name, t.type)}
        selectable={canEdit}
      />
    ))}
    <Placeholder
      open={!searchingTags && isEmpty(foundTags)}
      icon="local_offer"
      label="No tag found"
    />
  </List>
);

export default Content;
