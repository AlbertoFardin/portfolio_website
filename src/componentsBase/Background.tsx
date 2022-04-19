import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Colors from '../componentsBase/style/Colors';
import hexToRgbA from '../componentsBase/utils/hexToRgbA';
import Icon from '@material-ui/core/Icon';
import classnames from 'classnames';

const color1 = Colors.Purple;
const color2 = Colors.Blue;
const getPerc = (x: number) => (x ? `${x}%` : undefined);
const useStyles = makeStyles({
  background: {
    margin: 0,
    padding: 0,
    height: '100%',
    width: '100%',
    position: 'relative',
    background: `linear-gradient(to right, ${hexToRgbA(color1)} 0%, ${hexToRgbA(
      color2,
    )} 100%)`,
  },
});

enum IType {
  ROUND = 'ROUND',
  SQUARE = 'SQUARE',
}

const useStylesIcon = makeStyles({
  backgroundIcon: {
    position: 'absolute',
    margin: 'auto',
    'z-index': 0,
    opacity: 0,
    width: ({ size }: IBackgroundIcon) => size,
    height: ({ size }: IBackgroundIcon) => size,
    top: ({ top }: IBackgroundIcon) => getPerc(top),
    right: ({ right }: IBackgroundIcon) => getPerc(right),
    bottom: ({ bottom }: IBackgroundIcon) => getPerc(bottom),
    left: ({ left }: IBackgroundIcon) => getPerc(left),
    'background-color': '#ffffff',
    transition: 'all 1000ms',
    'border-radius': ({ type }: IBackgroundIcon) =>
      type === IType.ROUND ? 9999 : 15,
    'box-shadow': '0 5px 10px 5px rgba(0,0,0,0.3)',
    transform: 'translate3d(0, 100%, 0)',
  },
  backgroundIconAnimation: {
    opacity: 0.3,
    transform: 'none',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    margin: 'auto',
    'font-size': ({ size }: IBackgroundIcon) =>
      `${(size / 5) * 2}px !important`,
    color: ({ color }: IBackgroundIcon) => hexToRgbA(color, 0.75),
  },
});

interface IBackgroundIcon {
  color: string;
  type: IType;
  icon: string;
  size: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

const BackgroundIcon = (p: IBackgroundIcon) => {
  const classes = useStylesIcon(p);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const animation = setTimeout(() => {
      setReady(true);
    }, 500);
    return () => {
      clearTimeout(animation);
    };
  }, []);

  return (
    <div
      className={classnames({
        [classes.backgroundIcon]: true,
        [classes.backgroundIconAnimation]: ready,
      })}
    >
      <Icon className={classes.icon} children={p.icon} />
    </div>
  );
};

interface IBackground {
  children?: JSX.Element;
}

const Background = ({ children }: IBackground) => {
  const classes = useStyles({});
  return (
    <div className={classes.background}>
      {children}
      <BackgroundIcon
        color={color2}
        type={IType.ROUND}
        icon='chat_bubble'
        size={100}
        top={15}
        right={10}
      />
      <BackgroundIcon
        color={color2}
        type={IType.SQUARE}
        icon='public'
        size={75}
        top={40}
        right={25}
      />
      <BackgroundIcon
        color={color2}
        type={IType.ROUND}
        icon='how_to_reg'
        size={150}
        bottom={15}
        right={15}
      />
      <BackgroundIcon
        color={color1}
        type={IType.SQUARE}
        icon='file_download'
        size={75}
        top={18}
        left={12}
      />
      <BackgroundIcon
        color={color1}
        type={IType.ROUND}
        icon='thumb_up'
        size={150}
        top={35}
        left={18}
      />
      <BackgroundIcon
        color={color1}
        type={IType.SQUARE}
        icon='photo_library'
        size={100}
        bottom={20}
        left={14}
      />
    </div>
  );
};

export default Background;
