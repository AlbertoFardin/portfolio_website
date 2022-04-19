import * as React from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core";
import { emptyFn } from "../utils/common";
import reducer from "./reducer";
import LayoutAccordionHeader from "./LayoutAccordionHeader";
import { ILayoutAccordion, IPanel } from ".";

const useStyles = makeStyles({
  accordion: {
    width: "100%",
    height: "inherit",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  accordionContent: {
    flex: "none",
    height: 0,
    transition: "all 250ms",
    overflow: "hidden",
  },
  accordionContentExpanded: {
    flex: 1,
    height: "initial",
    "overflow-y": "overlay",
  },
});

/**
 * **LayoutAccordion** è componente che applica il layout di tipo "accordion"
 * [https://en.wikipedia.org/wiki/Accordion_(GUI)] all'array di panels passati come proprietà.
 *
 * Lo stato aperto/chiuso di ogni tab è gestito internamente al componente.
 */
const LayoutAccordion = ({
  className,
  onChange = emptyFn,
  initExpandedId = "",
  panels,
  style,
}: ILayoutAccordion) => {
  const classes = useStyles({});
  const initialState = panels.reduce((acc, p) => {
    acc[p.id] = p.id === initExpandedId;
    return acc;
  }, {});
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div
      style={style}
      className={classnames({
        [classes.accordion]: true,
        [className]: !!className,
      })}
    >
      {panels.map((p: IPanel) => (
        <React.Fragment key={p.id}>
          <LayoutAccordionHeader
            id={p.id}
            headerNode={p.headerNode}
            dispatch={dispatch}
            onChange={onChange}
            expanded={state[p.id]}
          />
          <div
            className={classnames({
              [classes.accordionContent]: true,
              [classes.accordionContentExpanded]: state[p.id],
            })}
            children={p.contentNode}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default LayoutAccordion;
