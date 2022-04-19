import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import getAggregations from "../../../../utils/getAggregations";
import { ACT_VPORT } from "../../reducer";
import IField from "./IField";
import getProps from "./getProps";
import { search } from "../../../../api/fetchesApi";
import { INDEX_NAME } from "../../../../constants";
import { ISearchEs } from "../../../../interfaces";
import { IFacetType } from "../../../../componentsBase/Facets";
import { ContextDispatchViewport } from "../../contexts";

const searchTabular = (p: ISearchEs) =>
  search({
    ...p,
    index: INDEX_NAME.TABULAR,
  });

enum ACT_FIELD {
  SEARCH = "SEARCH",
  FOUND = "FOUND",
  CLOSE = "CLOSE",
}

interface IReducerStateField {
  loading: boolean;
  levels: string[];
}

const reducerInitStateField = {
  loading: true,
  levels: [],
};

const reducerField = (state: IReducerStateField, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_FIELD.SEARCH: {
      newState.loading = true;
      return newState;
    }
    case ACT_FIELD.FOUND: {
      newState.loading = false;
      newState.levels = action.payload.map((a) => a.toLocaleUpperCase());
      return newState;
    }
    case ACT_FIELD.CLOSE: {
      newState.loading = false;
      return newState;
    }
    default: {
      console.error(`no action ${action.type}`);
      return state;
    }
  }
};

const KEY = "entityType";

interface IFieldLevel extends IField {
  value: string;
}

const FieldLevel = ({
  id,
  label,
  value,
  readOnly,
  className,
  attributeType,
}: IFieldLevel) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const [stateField, dispatchField] = React.useReducer(
    reducerField,
    reducerInitStateField
  );
  const { loading, levels } = stateField;
  const onChange = React.useCallback(
    (item, array: IFieldSelectItem[]) => {
      const newItem = array.find(({ selected }) => selected);
      const newValue = newItem ? newItem.id : null;
      const newValueIndex = levels.findIndex((k) => k === newValue);
      const newValueKey = newItem ? levels.slice(0, newValueIndex + 1) : null;
      dispatchViewport({
        type: ACT_VPORT.DETAIL_EDIT_KEYS,
        payload: [
          { key: id, value: newValue },
          { key: KEY, value: newValueKey },
        ],
      });
    },
    [dispatchViewport, id, levels]
  );
  const onClose = React.useCallback(() => {
    dispatchField({ type: ACT_FIELD.CLOSE });
  }, []);
  const valueComplete = levels.map((id) => ({
    id,
    label: id,
    selected: !!value && id === value.toLocaleUpperCase(),
  }));

  React.useEffect(() => {
    (async () => {
      if (loading) {
        const aggregations = await getAggregations({
          searchEs: searchTabular,
          filters: [
            {
              id: KEY,
              type: IFacetType.SELECTION,
              sticky: true,
              sortId: `${KEY}weight`,
            },
          ],
        });
        const levels = aggregations[0].items.map(({ key }) => key);
        dispatchField({ type: ACT_FIELD.FOUND, payload: levels });
      }
    })();
  }, [loading]);

  return (
    <FieldSelect
      {...getProps({
        id,
        label,
        readOnly,
        attributeType,
      })}
      className={className}
      value={valueComplete}
      onChange={onChange}
      onClose={onClose}
      itemsSelectedMaxLength={1}
    />
  );
};

export default FieldLevel;
