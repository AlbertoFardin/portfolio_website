import * as React from "react";
import { typeDict } from "../../reducer";
import IFieldsCmp from "../IFieldsCmp";
import FieldText from "../../../../componentsBase/Field/FieldText";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import FieldDict from "./FieldDict";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  ILabelPositionX,
  ILabelPositionY,
} from "../../../../componentsBase/Field/Label";
import { searchDictionaries } from "../../../../api/fetchesApi";
import { IDictionary } from "../../../../interfaces";

const useStyles = makeStyles({
  toolbar: {
    padding: 0,
  },
  toolbarTitle: {
    margin: "0 10px",
  },
  fieldDict: {
    margin: "25px 7px 5px",
    "vertical-align": "top",
    width: "-webkit-fill-available",
  },
});

const ListFieldsDict = ({ data }: IFieldsCmp) => {
  const classes = useStyles({});
  const [items, setItems] = React.useState([] as IDictionary[]);
  const { id, atype, dictionary } = data;

  React.useEffect(() => {
    (async () => {
      if (!!id) {
        if (dictionary) {
          const dicts = await searchDictionaries({
            dictionaryType: dictionary,
          });
          setItems(dicts);
        } else {
          setItems([]);
        }
      }
    })();
  }, [dictionary, id]);

  if (!typeDict.has(atype)) return null;

  return (
    <>
      <Divider style={{ margin: "20px 0" }} />
      <Toolbar className={classes.toolbar}>
        <FieldText
          className={classes.fieldDict}
          label={[
            {
              id: "label",
              label: "dictionary",
              positionX: ILabelPositionX.left,
              positionY: ILabelPositionY.top,
              required: true,
            },
          ]}
          value={dictionary}
          readOnly
        />
      </Toolbar>
      <List>
        {items.map((d) => (
          <FieldDict key={d.id} {...d} />
        ))}
      </List>
    </>
  );
};

export default ListFieldsDict;
