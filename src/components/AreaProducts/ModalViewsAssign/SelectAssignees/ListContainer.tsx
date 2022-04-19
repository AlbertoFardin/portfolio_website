import * as React from "react";
import useStyles from "../useStylesListContainer";
import { ContextM2ms, ContextUsers } from "../../../contexts";
import getUser from "../../../../utils/getUser";
import ListTitle from "../ListTitle";
import ListItem from "./ListItem";
import { IUserProfile } from "../../../../interfaces";
import FieldSearch from "../../../FieldSearch";
import Avatar from "@material-ui/core/Avatar";

const styleAvatar: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: 5,
  backgroundColor: "#ddd",
  height: 24,
  width: 24,
};
interface IListContainer {
  selectedIds: string[];
  onChange: (newSelectedIds: string[]) => void;
}

const ListContainer = ({ selectedIds, onChange }: IListContainer) => {
  const classes = useStyles({});
  const [searchValue, setSearchValue] = React.useState("");

  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const onSelect = React.useCallback(
    (itemId: string) => {
      const newSelectedId = Array.from(selectedIds);
      const itemIndex = selectedIds.findIndex((x) => x === itemId);
      const itemSelected = itemIndex !== -1;

      if (itemSelected) {
        newSelectedId.splice(itemIndex, 1);
      } else {
        newSelectedId.push(itemId);
      }

      onChange(newSelectedId);
    },
    [onChange, selectedIds]
  );

  const selectedSet = new Set(selectedIds);

  return (
    <div className={classes.listContainer}>
      <ListTitle title="Select Assegnee" selectedIds={selectedIds} />
      <FieldSearch
        style={{ width: "-webkit-fill-available" }}
        placeholder="Search user..."
        value={searchValue}
        onChange={setSearchValue}
      />
      <div className={classes.listContainerScroll}>
        {users.reduce((acc, u: IUserProfile) => {
          const { name, picture } = getUser(u.id, { users, m2ms });
          const valueItem = name.toLocaleLowerCase();
          const valueInput = searchValue.toLocaleLowerCase();
          const itemFound = valueItem.indexOf(valueInput) !== -1;

          if (!searchValue || (searchValue && itemFound)) {
            acc.push(
              <ListItem
                key={u.id}
                id={u.id}
                avatar={<Avatar style={styleAvatar} src={picture} />}
                label={name}
                selected={selectedSet.has(u.id)}
                onClick={onSelect}
              />
            );
          }
          return acc;
        }, [])}
      </div>
    </div>
  );
};

export default ListContainer;
