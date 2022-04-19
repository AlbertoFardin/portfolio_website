import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Tooltip from "../../../../componentsBase/Tooltip";
import classnames from "classnames";
import useStyles from "../useStylesSelect";
import ListCheckbox from "../ListCheckbox";

interface IListItem {
  id: string;
  label: string;
  disabledReason?: string[];
  disabled?: boolean;
  selected?: boolean;
  onClick: (id: string) => void;
  className?: string;
}

const ListItem = ({
  id,
  label,
  disabledReason = [],
  disabled = false,
  selected = false,
  onClick,
  className = "",
}: IListItem) => {
  const classes = useStyles({});
  return (
    <div
      className={classnames({
        [classes.listItem]: true,
        [className]: !!className,
      })}
    >
      <ListCheckbox
        id={id}
        label={label}
        disabled={disabled}
        selected={selected}
        onClick={onClick}
      />
      {!disabled ? null : (
        <Tooltip
          title={
            <Typography
              variant="body1"
              style={{ color: "#fff" }}
              children={
                <>
                  <span children="You can't deselect this Catalog because there is at least one media in Ready for this Catalog." />
                  <br />
                  <span children="To deselect this catalog, first deselect the following view(s): " />
                  {disabledReason.map((ds, i, a) => (
                    <React.Fragment key={ds}>
                      <span style={{ fontWeight: "bold" }} children={ds} />
                      {i + 1 === a.length ? null : <span children=", " />}
                    </React.Fragment>
                  ))}
                </>
              }
            />
          }
        >
          <Typography
            className={classes.listItemLabelDisabled}
            variant="body1"
            children="Can't deselect"
          />
        </Tooltip>
      )}
    </div>
  );
};

export default ListItem;
