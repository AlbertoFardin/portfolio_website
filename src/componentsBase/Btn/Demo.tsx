import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { action } from '@storybook/addon-actions';
import * as React from 'react';
import * as Colors from '../style/Colors';
import Btn from '.';
import { urlImage } from '../__stories__/mediaUrls';

const menuProps = {
  icon: true,
  iconClassName: 'xxx',
  title: 'Menu title',
  items: [
    {
      id: '1',
      label: 'item_1',
      onClick: action('onClick menu item_0'),
    },
    {
      id: '2',
      label: 'item_2',
      onClick: action('onClick menu item_1'),
    },
    {
      id: '3',
      label: 'item_3',
      onClick: action('onClick menu item_2'),
    },
  ],
};
const uploadProps = {
  onChangeInput: action('onChangeInput'),
  acceptFiles: '*',
  directory: '',
  multiple: true,
};

const BtnDemo = () => {
  const [color, setColor] = React.useState(Colors.Blue);
  const [menu, setMenu] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [selected, setSelected] = React.useState(false);
  const [avatar, setAvatar] = React.useState(false);
  const [upload, setUpload] = React.useState(false);
  const [tooltip, setTooltip] = React.useState(false);
  const [icon, setIcon] = React.useState(true);
  const [emoji, setEmoji] = React.useState(false);
  const [onclick, setOnclick] = React.useState(true);
  const [label, setLabel] = React.useState(true);
  const [labelRequired, setLabelRequired] = React.useState(false);
  const [labelPosition, setLabelPosition] = React.useState(
    'right' as 'left' | 'right',
  );
  const [variant, setVariant] = React.useState('light' as 'light' | 'bold');
  const onChangeLabelPosition = React.useCallback(() => {
    setLabelPosition(labelPosition === 'left' ? 'right' : 'left');
  }, [labelPosition]);
  const onChangeVariant = React.useCallback(() => {
    setVariant(variant === 'light' ? 'bold' : 'light');
  }, [variant]);
  const getCheckbox = (key, value, setValue) => (
    <Btn
      color={color}
      icon={value ? 'check_box' : 'check_box_outline_blank'}
      label={key}
      labelPosition={'right'}
      labelStyle={{ textAlign: 'left' }}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => setValue(!value)}
    />
  );
  const getSwitch = (label, checked, onChange) => (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} />}
      label={label}
    />
  );
  return (
    <div
      style={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: 'row',
          flex: 1,
        }}
      >
        <div style={{ flex: 1 }}>
          <Toolbar>
            <Btn
              onClick={onclick ? action('onClick') : undefined}
              color={color}
              icon={!icon ? undefined : 'settings'}
              label={!label ? undefined : 'Settings'}
              tooltip={!tooltip ? undefined : 'settings'}
              emoji={!emoji ? undefined : '👋'}
              selected={selected}
              disabled={disabled}
              menu={!menu ? undefined : menuProps}
              upload={!upload ? undefined : uploadProps}
              avatar={!avatar ? undefined : urlImage}
              labelPosition={labelPosition}
              labelRequired={labelRequired}
              variant={variant}
            />
          </Toolbar>
        </div>
        <div
          style={{
            width: 220,
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
            borderLeft: '1px solid #ddd',
          }}
        >
          {getCheckbox('emoji', emoji, setEmoji)}
          {getCheckbox('icon', icon, setIcon)}
          {getCheckbox('label', label, setLabel)}
          {getCheckbox('labelRequired', labelRequired, setLabelRequired)}
          {getCheckbox('tooltip', tooltip, setTooltip)}
          {getCheckbox('onClick', onclick, setOnclick)}
          {getCheckbox('selected', selected, setSelected)}
          {getCheckbox('disabled', disabled, setDisabled)}
          {getCheckbox('menu', menu, setMenu)}
          {getCheckbox('avatar', avatar, setAvatar)}
          {getCheckbox('upload', upload, setUpload)}
          {getSwitch(
            `labelPosition: ${labelPosition}`,
            labelPosition === 'right',
            onChangeLabelPosition,
          )}
          {getSwitch(
            `variant: ${variant}`,
            variant === 'light',
            onChangeVariant,
          )}
        </div>
      </div>
    </div>
  );
};

export default BtnDemo;
