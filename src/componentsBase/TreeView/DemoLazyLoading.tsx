import * as React from "react";
import { ITreeItem } from "./interfaces";
import TreeView from "./TreeView";

const mockItems: ITreeItem[] = [
  {
    id: "folder1",
    label: "Folder 1",
    parent: null,
    icon: "folder",
    hasChildren: true,
  },
  {
    id: "folder2",
    label: "Folder 2",
    parent: null,
    icon: "folder",
    hasChildren: true,
  },
  {
    id: "folder3",
    label: "Folder 3",
    parent: null,
    icon: "folder",
    hasChildren: true,
  },
  {
    id: "folder4",
    label: "Folder 4",
    parent: null,
    icon: "folder",
    hasChildren: true,
  },
  {
    id: "folder5",
    label: "Folder 5",
    parent: null,
    icon: "folder",
    hasChildren: true,
  },
  {
    id: "file1",
    label: "File 1",
    parent: null,
    icon: "insert_drive_file",
  },
  {
    id: "file2",
    label: "File 2",
    parent: null,
    icon: "insert_drive_file",
  },
];

enum ACTIONS {
  ON_TOGGLE = "ON_TOGGLE",
  LOAD_NODE = "LOAD_NODE",
}

interface IReducerState {
  items: ITreeItem[];
  expanded: string[];
  loadId: string;
}

const reducerInitState: IReducerState = {
  items: mockItems,
  expanded: [],
  loadId: "",
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.ON_TOGGLE: {
      const { expanded, items } = newState;
      const id = action.id;
      const ids = Array.from(expanded);
      const idIndex = ids.findIndex((i) => i === id);
      if (idIndex === -1) {
        // apro il nodo
        ids.push(id);

        // salvo il nodo interessato per il lazy loading
        newState.loadId = id;

        // cambio icona al nodo interessato
        const newItems = Array.from(items);
        const itemIndex = newItems.findIndex((c) => c.id === id);
        newItems.splice(itemIndex, 1, {
          ...newItems[itemIndex],
          icon: "access_time",
        });
        newState.items = newItems;
      } else {
        // chiudo il nodo
        ids.splice(idIndex, 1);
      }
      newState.expanded = ids;
      return newState;
    }
    case ACTIONS.LOAD_NODE: {
      const { loadId, items } = newState;

      // ripristino l'icona del nodo in loading
      const newItems = Array.from(items);
      const itemIndex = newItems.findIndex((c) => c.id === loadId);
      newItems.splice(itemIndex, 1, {
        ...newItems[itemIndex],
        icon: "folder",
      });
      newState.items = newItems;

      // aggiungo i nuovi items
      newState.items = Array.from(newState.items).concat(action.newItems);

      // resetto l'id in loading
      newState.loadId = reducerInitState.loadId;
      return newState;
    }
    default:
      return newState;
  }
};

const TreeViewDemo = () => {
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { items, expanded, loadId } = state as IReducerState;
  const onToggle = React.useCallback((id: string) => {
    dispatch({ type: ACTIONS.ON_TOGGLE, id });
  }, []);

  React.useEffect(() => {
    if (loadId) {
      // simulo una fetch che mi ritorni i children del nodo
      setTimeout(() => {
        const newItems = mockItems.map((c) => ({
          ...c,
          id: loadId + "/" + c.id,
          parent: loadId,
        }));
        dispatch({ type: ACTIONS.LOAD_NODE, newItems });
      }, 750);
    }
  }, [items, loadId]);

  return (
    <TreeView
      style={{ margin: 20 }}
      items={items}
      expanded={expanded}
      onToggle={onToggle}
    />
  );
};

export default TreeViewDemo;
