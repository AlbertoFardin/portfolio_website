import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Modal from "../../Modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IModalSortingPreference } from "./interfaces";
import SortRow from "./SortRow";
import isEqual from "lodash-es/isEqual";
import { ContextColumns, ContextDispatchViewport } from "../contexts";
import { IContentSort } from "../../../interfaces";
import FieldSelect from "../../../componentsBase/Field/FieldSelect/FieldSelect";
import { ISortOrder } from "../../../componentsBase/StickyGrid/interfaces";
import { ACT_VPORT } from "../reducer";
import { KEY_ENTITY_ID } from "../../../constants";

// a little function to help us with reordering the result
const reorder = (list: IContentSort[], startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 2,
  margin: `0 0 1px 0`,
  background: isDragging ? "lightgreen" : "white",

  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "white",
  padding: 2,
  width: 350,
});

const ModalSortingPreference = ({
  open,
  onClose,
  sortsContent,
}: IModalSortingPreference) => {
  const columns = React.useContext(ContextColumns);
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const [searchValue, setSearchValue] = React.useState("");

  const [items, setItems] = React.useState(sortsContent);

  const onConfirm = React.useCallback(() => {
    onClose();
    dispatchViewport({
      type: ACT_VPORT.SORT_CHECK_LOADING,
      payload: { loading: true, sorts: items },
    });
  }, [dispatchViewport, items, onClose]);

  const onSelectAttribute = React.useCallback(
    ({ id, label }) => {
      setItems(items.concat([{ id, label, order: ISortOrder.ASC }]));
      setSearchValue("");
    },
    [items]
  );

  const optionsWithoutRows = React.useMemo(
    () =>
      columns
        .filter((c) => c.sortable)
        .map((a) => ({ id: a.id, label: a.label }))
        .filter(({ id }) => !new Set(items.map((i) => i.id)).has(id)),
    [columns, items]
  );

  const options = React.useMemo(
    () =>
      optionsWithoutRows.filter(
        ({ label }) =>
          label.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      ),
    [optionsWithoutRows, searchValue]
  );

  const onDragEnd = React.useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const itemsNew = reorder(
        items,
        result.source.index,
        result.destination.index
      );

      setItems(itemsNew);
    },
    [items]
  );

  const onSortingChange = React.useCallback(
    (item: IContentSort) => {
      setItems(items.map((i) => (i.id === item.id ? item : i)));
    },
    [items]
  );

  const onDelete = React.useCallback(
    (k) => {
      const newItems = items.filter((i) => i.id !== k);
      if (newItems.length === 0) {
        const label = columns.find(({ id }) => id === KEY_ENTITY_ID).label;
        setItems([{ id: KEY_ENTITY_ID, label, order: ISortOrder.ASC }]);
      } else setItems(newItems);
    },
    [columns, items]
  );

  const onReplace = React.useCallback(
    (oldI, newI) => {
      setItems(items.map((i) => (i.id === oldI.id ? newI : i)));
    },
    [items]
  );

  const onSearch = React.useCallback((val) => {
    setSearchValue(val);
  }, []);

  React.useEffect(() => {
    if (open) setItems(sortsContent);
  }, [open, sortsContent]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sorting Preference"
      loading={false}
      content={
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <SortRow
                            item={item}
                            index={index}
                            onSortingChange={onSortingChange}
                            onDelete={onDelete}
                            deletionDisabled={
                              items.length === 1 && item.id === KEY_ENTITY_ID
                            }
                            onReplace={onReplace}
                            optionsWithoutRows={optionsWithoutRows}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <FieldSelect
            readOnly={items.length === 5}
            style={{
              flex: 1,
              marginTop: 5,
            }}
            placeholder="Add attribute..."
            searchable
            onChange={onSelectAttribute}
            onSearch={onSearch}
            options={options}
            itemsSelectedMaxLength={1}
            value={[]}
            adornmentIcon="search"
          />
          <Typography
            variant="body1"
            children="You can sort up to 5 attributes"
          />
        </>
      }
      actions={
        <>
          <div style={{ flex: 1 }} />
          <Btn variant="bold" label="CANCEL" onClick={onClose} />
          <Btn
            variant="bold"
            label="SORT"
            disabled={isEqual(items, sortsContent)}
            color={Colors.Cyan}
            onClick={onConfirm}
            tooltip={"TBD"}
          />
        </>
      }
    />
  );
};

export default ModalSortingPreference;
