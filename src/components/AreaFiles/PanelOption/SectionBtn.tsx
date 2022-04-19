import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FileSection } from "../../../interfaces";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import { colorTheme } from "../../../constants";
import mixColors from "../../../componentsBase/utils/mixColors";
import * as Colors from "../../../componentsBase/style/Colors";
import classnames from "classnames";
import { ROOT_MYFILE_LABEL, ROOT_SHARED_LABEL } from "../constants";

const getIcon = (id: FileSection): string => {
  switch (id) {
    case FileSection.MY_FILES:
      return "folder";
    case FileSection.SHARES_PRIVATE:
      return "people_alt";
    default:
      return "help_center";
  }
};
const getLabel = (id: FileSection): string => {
  switch (id) {
    case FileSection.MY_FILES:
      return ROOT_MYFILE_LABEL;
    case FileSection.SHARES_PRIVATE:
      return ROOT_SHARED_LABEL;
    default:
      return "Unknow";
  }
};

const useStyles = makeStyles({
  btn: {
    "&:hover": {
      "background-color": Colors.Gray4,
    },
    "background-color": "transparent",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    padding: "10px 20px",
    "border-radius": 50,
    color: colorTheme,
  },
  btnIcon: {
    color: Colors.Gray2,
    margin: "0 10px 0 0px",
    "font-size": "18px !important",
  },
  btnLabel: {
    color: Colors.Gray1,
    "font-weight": "normal",
  },
  selectedBackground: {
    "background-color": `${mixColors(0.8, colorTheme, "#ffffff")} !important`,
  },
  selectedColor: {
    color: colorTheme,
    "font-weight": "bold",
  },
  flex1: {
    flex: 1,
  },
});

interface ISectionBtn {
  className?: string;
  sectionId: FileSection;
  selected: boolean;
  onClick: (sectionId: FileSection) => void;
}

const SectionBtn = ({
  className,
  sectionId,
  selected,
  onClick,
}: ISectionBtn) => {
  const classes = useStyles({});
  const onChange = React.useCallback(() => {
    onClick(sectionId);
  }, [onClick, sectionId]);
  return (
    <ButtonBase
      className={classnames({
        [classes.btn]: true,
        [classes.selectedBackground]: selected,
        [className]: !!className,
      })}
      onClick={onChange}
    >
      <Icon
        className={classnames({
          [classes.btnIcon]: true,
          [classes.selectedColor]: selected,
        })}
        children={getIcon(sectionId)}
      />
      <Typography
        className={classnames({
          [classes.btnLabel]: true,
          [classes.selectedColor]: selected,
        })}
        variant="body1"
        children={getLabel(sectionId)}
      />
      <div className={classes.flex1} />
    </ButtonBase>
  );
};

export default SectionBtn;
