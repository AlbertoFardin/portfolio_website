import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography } from "@material-ui/core";
import {
  APP_COLORS,
  AREA_PRODUCTS,
  ID_COLUMNS,
  ID_FIELDS_PANEL_DETAILS,
  ID_FILTERS,
  LAYOUT_GRID,
} from "../../constants";
import { useHistory } from "react-router-dom";
import reducer, {
  ACT_VPORT,
  reducerInitState,
  VALUE_ALL_LEVEL,
} from "./reducer";
import manageFetchErrors, {
  genericErrorText,
} from "../../utils/manageFetchErrors";
import { getConfigTabular } from "../../api/configurations";
import { getJsonConfigsSet } from "../../api/fetchesApi";
import getSetsDocId from "../../utils/getJsonDocId";
import itemsSetsDefault from "../../api/itemsSetsDefault";
import { ConfigType } from "./interfaces";
import DialogUnsaved from "./DialogUnsaved";
import LoadingMask from "../../componentsBase/LoadingMask";
import ActionsBar from "./ActionsBar";
import FieldSearch from "../FieldSearch";
import { ContextSetSnackbar } from "../contexts";
import { Severity } from "../../interfaces";
import {
  saveHashColumnsSets,
  saveHashFieldsPanelDetailsSet,
  saveHashFiltersSets,
} from "./utils/saveFn";
import CheckboxTypeByFamily from "./CheckboxTypeByFamily";
import TitleWithSelectField from "./TitleWithSelectField";
import ConfigurationRow from "./ConfigurationRow";
import CheckboxByIdAndType from "./CheckboxByIdAndType";

const useStyles = makeStyles({
  viewport: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "row",
  },
  toolbar: {
    padding: "0 15px",
  },
});

const Area = () => {
  const classes = useStyles({});

  const setSnackbar = React.useContext(ContextSetSnackbar);

  const history = useHistory();
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    initialized,
    datas,
    saving,
    dialogUnsaved,
    searchInput,
    filteredDatas,
    columns,
    hashColumnsSets,
    hashFiltersSets,
    hashFieldsPanelDetailsSet,
    levelFiltered,
    columnSetInEdit,
    filtersSetInEdit,
    fieldsPanelDetailsInEdit,
  } = state;

  const checkAllFamily = React.useCallback(
    (attributeFamily, confType, checked) => {
      dispatch({
        type: ACT_VPORT.CHANGE_ALL_TYPE_FAMILY,
        attributeFamily,
        confType,
        checked,
      });
    },
    []
  );

  const checkIdByType = React.useCallback((id, confType, checked) => {
    dispatch({
      type: ACT_VPORT.CHANGE_ID_ATTRIBUTE_TYPE,
      id,
      confType,
      checked,
    });
  }, []);

  const onSearchInput = React.useCallback((value: string) => {
    dispatch({
      type: ACT_VPORT.SET_SEARCH_INPUT,
      value,
    });
  }, []);

  const filterByLevel = React.useCallback((event) => {
    const { value } = event.target;
    dispatch({ type: ACT_VPORT.SET_LEVEL_FILTER, value });
  }, []);

  const changeFilterCurrentSet = React.useCallback((event) => {
    const { value } = event.target;
    dispatch({ type: ACT_VPORT.SET_CURRENT_FILTER_SET, value });
  }, []);

  const changeColumnCurrentSet = React.useCallback((event) => {
    const { value } = event.target;
    dispatch({ type: ACT_VPORT.SET_CURRENT_COLUMN_SET, value });
  }, []);

  const changeDetailPanelCurrentSet = React.useCallback((event) => {
    const { value } = event.target;
    dispatch({ type: ACT_VPORT.SET_CURRENT_DETAIL_PANEL_SET, value });
  }, []);

  const dirtyCount = datas.reduce((acc, data) => {
    data.attributes.forEach((a) => {
      if (a.filter.dirty) acc++;
      if (a.column.dirty) acc++;
      if (a.detailPanel.dirty) acc++;
    });
    return acc;
  }, 0);

  const levelOptions = React.useMemo(() => {
    const levelValues = Array.from(new Set(columns.map((c) => c.groupId)));
    return [{ value: "all", label: "All" }].concat(
      levelValues.map((l) => ({ value: l, label: l }))
    );
  }, [columns]);

  const filtersSetOptions = React.useMemo(() => {
    return hashFiltersSets.itemsSets.map((i) => ({
      value: i.id,
      label: i.label,
    }));
  }, [hashFiltersSets.itemsSets]);

  const columnsSetOptions = React.useMemo(() => {
    return hashColumnsSets.columsnSets.map((i) => ({
      value: i.id,
      label: i.label,
    }));
  }, [hashColumnsSets.columsnSets]);

  const detailsSetOptions = React.useMemo(() => {
    return hashFieldsPanelDetailsSet.itemsSets.map((i) => ({
      value: i.id,
      label: i.label,
    }));
  }, [hashFieldsPanelDetailsSet.itemsSets]);

  const showAllAttributes = !searchInput && levelFiltered === VALUE_ALL_LEVEL;

  React.useEffect(() => {
    if (!initialized) {
      (async () => {
        const fn = async () => {
          const [
            { filters: filtersConf, columns },
            { hash: hashColumnSet, payload: payloadColumnSet },
            { hash: hashFiltersSets, payload: payloadFiltersSets },
          ] = await Promise.all([
            getConfigTabular(),
            getJsonConfigsSet({
              docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_COLUMNS),
            }),
            getJsonConfigsSet({
              docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_FILTERS),
            }),
          ]);

          const {
            hash: hashFieldsPanelDetailsSet,
            payload: payloadFieldsPanelDetailsSet,
          } = await getJsonConfigsSet({
            docId: getSetsDocId(
              AREA_PRODUCTS,
              LAYOUT_GRID,
              ID_FIELDS_PANEL_DETAILS
            ),
            itemsSetsDef: itemsSetsDefault(columns.map(({ id }) => ({ id }))),
          });

          dispatch({
            type: ACT_VPORT.INIT,
            columns,
            filters: filtersConf,
            hashColumnsSets: {
              hash: hashColumnSet,
              saving: false,
              columsnSets: payloadColumnSet,
            },
            hashFiltersSets: {
              hash: hashFiltersSets,
              saving: false,
              itemsSets: payloadFiltersSets,
            },
            hashFieldsPanelDetailsSet: {
              hash: hashFieldsPanelDetailsSet,
              saving: false,
              itemsSets: payloadFieldsPanelDetailsSet,
            },
          });
        };
        manageFetchErrors({
          fetch: fn,
          history,
        });
      })();
    }
  }, [history, initialized]);

  React.useEffect(() => {
    (async () => {
      try {
        if (saving) {
          const [
            newHashFiltersSets,
            newHashColumnsSets,
            newHashFieldsPanelDetailsSet,
          ] = await Promise.all([
            saveHashFiltersSets({ datas, filtersSetInEdit, hashFiltersSets }),
            saveHashColumnsSets({
              datas,
              columns,
              columnSetInEdit,
              hashColumnsSets,
            }),
            saveHashFieldsPanelDetailsSet({
              datas,
              fieldsPanelDetailsInEdit,
              hashFieldsPanelDetailsSet,
            }),
          ]);
          setSnackbar(Severity.SUCCESS, "Configurations saved");

          dispatch({
            type: ACT_VPORT.SAVE_STOPPED,
            newHashFiltersSets,
            newHashColumnsSets,
            newHashFieldsPanelDetailsSet,
          });
        }
      } catch {
        setSnackbar(Severity.WARNING, genericErrorText);
      }
    })();
  }, [
    columnSetInEdit,
    columns,
    datas,
    fieldsPanelDetailsInEdit,
    filtersSetInEdit,
    hashColumnsSets,
    hashFieldsPanelDetailsSet,
    hashFiltersSets,
    saving,
    setSnackbar,
  ]);

  return (
    <div className={classes.viewport}>
      <LoadingMask open={saving} spinner={false} />
      <DialogUnsaved
        dispatchPanel={dispatch}
        open={dialogUnsaved}
        dirtyCount={dirtyCount}
      />
      <div style={{ flex: 1 }} />

      <div
        style={{
          paddingTop: 20,
          display: "flex",
          width: 650,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 100,
          }}
        >
          <Typography variant="body2">CONFIGURE YOUR WORKING AREA</Typography>
          <Typography variant="caption">
            Product Area - Filter, Column and Field Set{" "}
          </Typography>
          <ConfigurationRow
            title={
              <FieldSearch
                style={{ width: 200 }}
                placeholder="Search attributes..."
                value={searchInput}
                onChange={onSearchInput}
              />
            }
            level={
              <TitleWithSelectField
                title="Level"
                value={levelFiltered}
                options={levelOptions}
                handleChange={filterByLevel}
              />
            }
            filter={
              <TitleWithSelectField
                title="Filter"
                disabled={dirtyCount !== 0}
                value={filtersSetInEdit?.id || ""}
                options={filtersSetOptions}
                handleChange={changeFilterCurrentSet}
              />
            }
            column={
              <TitleWithSelectField
                title="Column"
                disabled={dirtyCount !== 0}
                value={columnSetInEdit?.id || ""}
                options={columnsSetOptions}
                handleChange={changeColumnCurrentSet}
              />
            }
            detailPanel={
              <TitleWithSelectField
                title="Detail Panel"
                disabled={dirtyCount !== 0}
                value={fieldsPanelDetailsInEdit?.id || ""}
                options={detailsSetOptions}
                handleChange={changeDetailPanelCurrentSet}
              />
            }
          />
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "scroll",
          }}
        >
          {(showAllAttributes ? datas : filteredDatas).map(
            ({ attributeFamily, attributes }) => (
              <div key={attributeFamily}>
                <ConfigurationRow
                  title={
                    <Typography style={{ paddingLeft: 10 }} variant="body2">
                      {attributeFamily}
                    </Typography>
                  }
                  filter={
                    <CheckboxTypeByFamily
                      datas={datas}
                      disabled={!showAllAttributes}
                      confType={ConfigType.FILTERS}
                      attributeFamily={attributeFamily}
                      onClick={checkAllFamily}
                    />
                  }
                  column={
                    <CheckboxTypeByFamily
                      datas={datas}
                      disabled={!showAllAttributes}
                      confType={ConfigType.COLUMNS}
                      attributeFamily={attributeFamily}
                      onClick={checkAllFamily}
                    />
                  }
                  detailPanel={
                    <CheckboxTypeByFamily
                      datas={datas}
                      disabled={!showAllAttributes}
                      confType={ConfigType.DETAILS_PANEL}
                      attributeFamily={attributeFamily}
                      onClick={checkAllFamily}
                    />
                  }
                  backgroundColor={APP_COLORS.colorLight}
                />
                {attributes.map(
                  ({ id, label, level, filter, column, detailPanel }) => (
                    <ConfigurationRow
                      key={id}
                      title={
                        <Typography
                          style={{ paddingLeft: 20 }}
                          variant="caption"
                        >
                          {label}
                        </Typography>
                      }
                      level={<Typography variant="caption">{level}</Typography>}
                      filter={
                        <CheckboxByIdAndType
                          id={id}
                          confType={ConfigType.FILTERS}
                          checked={filter.enabled}
                          disabled={!filter.available}
                          onClick={checkIdByType}
                        />
                      }
                      column={
                        <CheckboxByIdAndType
                          id={id}
                          confType={ConfigType.COLUMNS}
                          checked={column.enabled}
                          disabled={!column.available}
                          onClick={checkIdByType}
                        />
                      }
                      detailPanel={
                        <CheckboxByIdAndType
                          id={id}
                          confType={ConfigType.DETAILS_PANEL}
                          checked={detailPanel.enabled}
                          disabled={!detailPanel.available}
                          onClick={checkIdByType}
                        />
                      }
                    />
                  )
                )}
              </div>
            )
          )}
        </div>
        <ActionsBar
          dispatchPanel={dispatch}
          dirtyCount={dirtyCount}
          saving={saving}
        />
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default Area;
