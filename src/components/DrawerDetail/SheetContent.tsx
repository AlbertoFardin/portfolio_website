import * as React from "react";
import LoadingMask from "../../componentsBase/LoadingMask";
import Placeholder from "../../componentsBase/Placeholder";
import Toolbar from "@material-ui/core/Toolbar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { SheetStatus } from "../../interfaces";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import SheetError from "./SheetError";
import classnames from "classnames";

const useStyles = makeStyles({
  flex1: {
    flex: 1,
  },
  sheetToolbar: {
    padding: "0 10px",
  },
  sheetContent: {
    position: "relative",
    flex: 1,
    "min-height": 0,
    overflow: "hidden",
    display: "flex",
    "flex-direction": "column",
  },
});

export interface ISheetContent {
  classNameTitle?: string;
  classNameContent?: string;
  title: JSX.Element;
  content: JSX.Element | React.ReactNode;
  status: SheetStatus;
  onError?: (error: Error, info: { componentStack: string }) => void;
  onReset: () => void;
}

const SheetContent = ({
  classNameTitle,
  classNameContent,
  title,
  content,
  status,
  onError,
  onReset,
}: ISheetContent) => {
  const classes = useStyles({});
  const FallbackComponent = React.useMemo(() => {
    // eslint-disable-next-line react/display-name
    return ({ error }: FallbackProps) => (
      <SheetError error={error.message} onReset={onReset} />
    );
  }, [onReset]);
  const visibled = status === SheetStatus.VISIBLE;

  return (
    <>
      {!visibled || !title ? null : (
        <Toolbar
          className={classnames({
            [classes.sheetToolbar]: true,
            [classNameTitle]: !!classNameTitle,
          })}
          children={title}
        />
      )}
      <div
        className={classnames({
          [classes.sheetContent]: true,
          [classNameContent]: !!classNameContent,
        })}
      >
        <LoadingMask open={status === SheetStatus.LOADING} />
        <Placeholder
          open={status === SheetStatus.PHOLDER}
          icon="announcement"
          label="Please select an item to show details"
        />
        {!visibled ? null : (
          <ErrorBoundary
            fallbackRender={FallbackComponent}
            onError={onError}
            children={content}
          />
        )}
      </div>
    </>
  );
};

export default SheetContent;
