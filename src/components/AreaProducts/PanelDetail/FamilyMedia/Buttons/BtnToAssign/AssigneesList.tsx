import * as React from "react";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ContextUsers } from "../../../../../contexts";
import AssigneesListItem from "./AssigneesListItem";
import Placeholder from "../../../../../../componentsBase/Placeholder";
import isEmpty from "lodash-es/isEmpty";

const useStyles = makeStyles({
  list: {
    height: 245,
    "overflow-y": "auto",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
});

interface IAssigneesList {
  inputSearch: string;
  selectedIds: string[];
  onChange: (userId: string) => void;
}

const AssigneesList = ({
  inputSearch,
  selectedIds,
  onChange,
}: IAssigneesList) => {
  const classes = useStyles({});
  const users = React.useContext(ContextUsers);
  const usersMatch = users.filter((u) => {
    const { firstName, lastName } = u;
    const label = `${firstName} ${lastName}`;
    return label.toUpperCase().includes(inputSearch.toUpperCase());
  });

  return (
    <List className={classes.list}>
      {isEmpty(usersMatch) ? (
        <Placeholder icon="search" label="No user found" />
      ) : (
        usersMatch.map((u) => (
          <AssigneesListItem
            key={u.id}
            userId={u.id}
            onClick={onChange}
            inputSearch={inputSearch}
            selectedIds={selectedIds}
          />
        ))
      )}
    </List>
  );
};

export default AssigneesList;
