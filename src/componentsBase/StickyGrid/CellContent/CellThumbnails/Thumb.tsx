import classnames from 'classnames';
import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PaperFold from '../../../PaperFold';
import Preview, { PreviewType } from '../../../Preview';
import TypographyEllipsis from '../../../TypographyEllipsis';
import Fade from '@material-ui/core/Fade';
import Btn from '../../../Btn';
import { getThumbBorderRadius } from './utils';
import { ICellClick, IThumbnail } from '../../interfaces';

const thumbColor = '#EFEFEF';
interface IStyles {
  srcUrl: string;
  thumbSize: number;
  thumbMargin: number;
  mousehover: boolean;
}
const useStyles = makeStyles({
  thumb: {
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${thumbColor}`,
    'background-color': thumbColor,
    'border-radius': ({ thumbSize }: IStyles) =>
      getThumbBorderRadius(thumbSize),
    height: ({ thumbSize }: IStyles) => thumbSize,
    width: ({ thumbSize }: IStyles) => thumbSize,
    margin: ({ thumbMargin }: IStyles) => thumbMargin,
  },
  thumbSelected: {
    'font-weight': 'bolder',
  },
  thumbContent: {
    position: 'relative',
    width: 'inherit',
    height: 'inherit',
  },
  labelContainer: {
    transition: 'all 250ms',
    position: 'absolute',
    margin: 'auto',
    right: 0,
    bottom: 28,
    left: 0,
    width: ({ thumbSize }: IStyles) => thumbSize - 20,
    'z-index': 1,
  },
  label: {
    transition: 'all 250ms',
    color: '#fff',
    'text-align': 'center',
    'font-size': 13,
    flex: 1,
  },
});

interface IThumb {
  style: React.CSSProperties;
  columnIndex: number;
  data: {
    columnIndex: number;
    rowIndex: number;
    thumbs: IThumbnail[];
    thumbSize: number;
    thumbMargin: number;
    selected: boolean;
    focused: boolean;
    onClick: (p: ICellClick) => void;
    onDoubleClick: (p: ICellClick) => void;
    thumbFixedSized?: boolean;
  };
}

const Thumb = ({ style: styleCell, data, columnIndex: index }: IThumb) => {
  const {
    columnIndex,
    rowIndex,
    thumbs,
    thumbSize,
    thumbMargin,
    selected,
    focused,
    onClick,
    onDoubleClick,
    thumbFixedSized,
  } = data;
  const {
    badges,
    id,
    label,
    labelStyle,
    placeholderLabel,
    placeholderLabelStyle,
    placeholderLabelRequired,
    placeholderIcon,
    placeholderIconStyle,
    paperFold,
    paperFoldProps,
    srcType,
    srcUrl,
    className,
    classNamePreview,
    style,
    stylePreview,
  }: IThumbnail = thumbs[index];
  const [mousehover, setMousehover] = React.useState(false);
  const classes = useStyles({
    thumbMargin,
    thumbSize,
    srcUrl,
    mousehover,
  });
  const onClickThumb = React.useCallback(
    ({ ctrlDown, shiftKey }, event) => {
      const clickProps: ICellClick = {
        thumbId: id,
        columnIndex,
        rowIndex,
        selected,
        focused,
        keyCtrlDown: ctrlDown,
        keyShiftDown: shiftKey,
      };
      if (event.detail === 1) {
        onClick(clickProps);
      } else {
        onDoubleClick(clickProps);
      }
    },
    [columnIndex, focused, id, onClick, onDoubleClick, rowIndex, selected],
  );
  const onMouseEnter = React.useCallback(
    (event) => {
      event.persist();
      if (srcUrl) setMousehover(true);
    },
    [srcUrl],
  );
  const onMouseLeave = React.useCallback((event) => {
    event.persist();
    setMousehover(false);
  }, []);

  return (
    <div style={styleCell}>
      <div
        style={style}
        className={classnames({
          [classes.thumb]: true,
          [classes.thumbSelected]: selected,
          [className]: !!className,
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {(badges || []).map((b, i) => (
          <Btn key={`badge_${i}`} {...b} />
        ))}

        <Fade in={!!(label && mousehover)}>
          <div className={classes.labelContainer}>
            <TypographyEllipsis
              variant='subtitle2'
              className={classes.label}
              style={labelStyle}
              children={label}
            />
          </div>
        </Fade>

        <PaperFold
          anchorHorizontal='right'
          anchorVertical='bottom'
          open={paperFold}
          size={getThumbBorderRadius(thumbSize)}
          {...paperFoldProps}
        />
        <Preview
          disabledLoadingMask={true}
          className={classNamePreview}
          thumbFixedSized={!!thumbFixedSized}
          style={{
            height: thumbSize,
            width: thumbSize,
            ...stylePreview,
          }}
          mousehover={mousehover}
          placeholderIcon={placeholderIcon}
          placeholderIconStyle={placeholderIconStyle}
          placeholderLabel={placeholderLabel}
          placeholderLabelRequired={placeholderLabelRequired}
          placeholderLabelStyle={placeholderLabelStyle}
          srcUrl={srcUrl}
          srcType={srcType || PreviewType.IMAGE}
          onClick={onClickThumb}
        />
      </div>
    </div>
  );
};

export default React.memo(Thumb);
