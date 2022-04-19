import classnames from "classnames";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { emptyFn } from "../utils/common";
import isEqual from "lodash-es/isEqual";
import loadable from "@loadable/component";
import PreviewType from "./PreviewType";
import hexToRgbA from "../utils/hexToRgbA";
import { reducer, reducerInitState, ACTION } from "./reducer";

const PreviewImage = loadable(() => import("./PreviewImage"));
const PreviewVideo = loadable(() => import("./PreviewVideo"));

const ClickManager = loadable(() => import("../ClickManager"));
const LoadingMask = loadable(() => import("../LoadingMask"));
const Placeholder = loadable(() => import("../Placeholder"));

interface IStyles {
  colorTheme: string;
}
const useStyles = makeStyles(({ palette }) => {
  const colorMain = palette.primary.main;
  return {
    preview: {
      position: "relative",
      "box-sizing": "border-box",
      margin: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    mask: {
      opacity: 0,
      position: "absolute",
      transition: "opacity 350ms",
      width: "100%",
      height: "100%",
      margin: "auto",
      top: 0,
      left: 0,
      color: ({ colorTheme }: IStyles) => colorTheme || colorMain,
      backgroundColor: ({ colorTheme }: IStyles) =>
        hexToRgbA(colorTheme || colorMain, 0.25),
    },
    maskOpen: {
      opacity: 1,
    },
  };
});

interface IPreview {
  className?: string;
  disabledLoadingMask?: boolean;
  loading?: boolean;
  mousehover?: boolean;
  onClick?: (
    a: { ctrlDown: boolean; shiftKey: boolean },
    event: MouseEvent
  ) => void;
  onDoubleClick?: (event: MouseEvent) => void;
  onLoadError?: () => void;
  onLoadSuccess?: () => void;
  placeholderIcon?: string;
  placeholderIconStyle?: React.CSSProperties;
  placeholderLabel?: string;
  placeholderLabelStyle?: React.CSSProperties;
  placeholderLabelRequired?: boolean;
  colorTheme?: string;
  selected?: boolean;
  srcUrl: string;
  srcType: PreviewType;
  style?: React.CSSProperties;
  thumbFixedSized?: boolean;
}

export const Preview = ({
  className,
  loading = false,
  mousehover = false,
  onClick = emptyFn,
  onDoubleClick = emptyFn,
  onLoadError = emptyFn,
  onLoadSuccess = emptyFn,
  placeholderIcon,
  placeholderIconStyle,
  placeholderLabelRequired = false,
  placeholderLabel,
  placeholderLabelStyle,
  colorTheme,
  selected = false,
  srcUrl,
  srcType,
  disabledLoadingMask = false,
  thumbFixedSized = false,
  style,
}: IPreview) => {
  if (typeof style.width !== "number" && typeof style.height !== "number") {
    console.error('Preview "style.width" and "style.height" must be a numbers');
  }

  const classes = useStyles({ colorTheme });
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { srcError, srcLoaded, placeholder } = state;
  const size = Math.min(Number(style.width), Number(style.height));
  const previewPlaceholder = React.useMemo(
    () => (
      <Placeholder
        color={colorTheme}
        icon={placeholderIcon}
        iconStyle={{
          fontSize: size / 4,
          color: "#ddd",
          ...placeholderIconStyle,
        }}
        label={placeholderLabel}
        labelStyle={{ fontSize: size / 5, ...placeholderLabelStyle }}
        labelRequired={placeholderLabelRequired}
        style={{ cursor: "pointer" }}
      />
    ),
    [
      colorTheme,
      placeholderIcon,
      placeholderIconStyle,
      placeholderLabel,
      placeholderLabelRequired,
      placeholderLabelStyle,
      size,
    ]
  );

  React.useEffect(() => {
    if (srcUrl && srcType) {
      dispatch({ type: ACTION.RESET });
    } else {
      dispatch({ type: ACTION.PLACEHOLDER });
    }
  }, [srcUrl, srcType]);

  const onSrcLoad = React.useCallback(() => {
    dispatch({ type: ACTION.SRC_LOADED });
    onLoadSuccess();
  }, [onLoadSuccess]);
  const onSrcError = React.useCallback(() => {
    dispatch({ type: ACTION.SRC_ERROR });
    onLoadError();
  }, [onLoadError]);
  const previewProps = {
    mousehover,
    onSrcLoad,
    onSrcError,
    srcLoaded,
    srcUrl,
    style,
    thumbFixedSized,
  };
  const renderCheck = React.useCallback(
    (type: PreviewType, cmp: JSX.Element) => {
      if (srcError || srcType !== type) return null;
      return cmp;
    },
    [srcError, srcType]
  );

  return (
    <ClickManager
      className={classnames({
        [classes.preview]: true,
        [className]: !!className,
      })}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {placeholder ? previewPlaceholder : null}
      {renderCheck(PreviewType.IMAGE, <PreviewImage {...previewProps} />)}
      {renderCheck(PreviewType.VIDEO, <PreviewVideo {...previewProps} />)}
      <div
        className={classnames({
          [classes.mask]: true,
          [classes.maskOpen]: mousehover || selected,
        })}
      />
      <LoadingMask
        open={
          !disabledLoadingMask &&
          !placeholder &&
          (loading || (!srcLoaded && !srcError))
        }
        spinnerColor="#fff"
      />
    </ClickManager>
  );
};

export default React.memo(Preview, isEqual);
