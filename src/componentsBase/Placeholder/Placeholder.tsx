import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import classnames from "classnames";
import * as React from "react";
import * as Colors from "../style/Colors";

const Flex1 = () => <div style={{ flex: 1 }} />;
const useStyle = makeStyles({
  placeholder: {
    position: "absolute",
    "text-align": "center",
    height: "100%",
    width: "100%",
    "user-select": "none",
    cursor: "default",
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
  },
  label: {
    display: "flex",
  },
});

export interface IPlaceholder {
  /** Component CSS classes */
  className?: string;
  /** CSS color of "icon" and "label" */
  color?: string;
  /** Icon to render. Please use a material-icon's Id */
  icon?: string;
  /** Icon CSS classes. Only used with "icon" evaluated */
  iconClassName?: string;
  /** Icon CSS style. Only used with "icon" evaluated */
  iconStyle?: React.CSSProperties;
  /** Typography to render */
  label?: string;
  /** Typography CSS classes. Only used with "label" evaluated */
  labelClassName?: string;
  /** Typography CSS style. Only used with "label" evaluated */
  labelStyle?: React.CSSProperties;
  /** If true, a required sign appear near Typography. Only used with "label" evaluated */
  labelRequired?: boolean;
  /** If false, the component not render  */
  open?: boolean;
  /** Component CSS style */
  style?: React.CSSProperties;
}

/**
 * **Placeholder** è un componente che renderizza un'etichetta o/e un'icona al centro di una maschera modale trasparente.
 * Viene principalmente utilizzato per inserire un segnaposto nel caso il *"componente-padre"* sia vuoto.
 *
 * Placeholder ha CSS _<span style="color:#aaa">"position:absolute; width:100%; height:100%"</span>_ quindi copre tutto lo spazio dove è inserito.
 * Per funzionare correttamente, il *"componente-padre"* deve essere stylizzato con _<span style="color:#aaa">"position:relative"</span>_.
 */
const Placeholder = ({
  className,
  color = Colors.Gray2,
  icon,
  iconClassName,
  iconStyle,
  label,
  labelClassName,
  labelStyle,
  labelRequired,
  open = true,
  style,
}: IPlaceholder) => {
  const classes = useStyle({});
  const iconStyleFix = { color, fontSize: 60, ...iconStyle };
  const labelStyleFix = { color, fontSize: 12, ...labelStyle };

  if (!open || (!icon && !label)) return null;

  return (
    <div
      style={style}
      className={classnames({
        [classes.placeholder]: true,
        [className]: !!className,
      })}
    >
      <Flex1 />
      {icon && (
        <Icon style={iconStyleFix} className={iconClassName} children={icon} />
      )}
      {label && (
        <Typography
          variant="body1"
          style={labelStyleFix}
          className={classnames({
            [classes.label]: true,
            [labelClassName]: !!labelClassName,
          })}
          children={
            <>
              {label}
              {labelRequired && (
                <span
                  style={{
                    color: "#ff0000",
                    margin: 0,
                    marginLeft: 2,
                    fontSize: Number(labelStyleFix.fontSize) / 2,
                    lineHeight: 2,
                  }}
                  children={"*"}
                />
              )}
            </>
          }
        />
      )}
      <Flex1 />
    </div>
  );
};

export default Placeholder;
