import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";

interface IStyle {
  backgroundColor: string;
  spinnerColor: string;
}
const useStyle = makeStyles({
  center: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
  },
  loadingmask: {
    "background-color": ({ backgroundColor }: IStyle) => backgroundColor,
    height: "100%",
    width: "100%",
    "z-index": 3,
  },
  loadingmaskSpinner: {
    "z-index": 100,
    display: "block",
    color: ({ spinnerColor }: IStyle) => spinnerColor,
  },
});

export interface ILoadingMask {
  /** Background's color of the mask */
  backgroundColor?: string;
  /** If true, the mask is open */
  open?: boolean;
  /** If true, show spinner */
  spinner?: boolean;
  /** Spinner's color (default is theme color) */
  spinnerColor?: string;
  /** Spinner's size */
  spinnerSize?: number;
}

/**
 * **LoadingMask** è una _<span style="color:#aaa">`<div/>`</span>_ contenente uno _<span style="color:#aaa">`<CircularProgress/>`</span>_.
 *
 * Questo componente è utilizzato come "maschera" per bloccare click ed azioni dell'utente.
 * Infatti, questa maschera occupa interamente lo spazio dove è inserita e prende come
 * riferimento il *div-padre* che possiede la proprietà CSS _<span style="color:#aaa">"position:relative;"</span>_
 */
const LoadingMask = ({
  backgroundColor = "transparent",
  open = false,
  spinner = true,
  spinnerColor,
  spinnerSize = 40,
}: ILoadingMask) => {
  const classes = useStyle({ backgroundColor, spinnerColor });
  return !open ? null : (
    <div className={classnames([classes.loadingmask, classes.center])}>
      {!spinner ? null : (
        <CircularProgress
          size={spinnerSize}
          className={classnames([classes.loadingmaskSpinner, classes.center])}
        />
      )}
    </div>
  );
};

export default LoadingMask;
