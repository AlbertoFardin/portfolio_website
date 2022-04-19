import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as moment from "moment";
import * as React from "react";
import TypographyEllipsis from "../../TypographyEllipsis";
import { IAnnotation } from "../interfaces";

const useStyles = makeStyles({
  toolbar: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    margin: 0,
    padding: 0,
  },
  textContainer: {
    display: "flex",
    "flex-direction": "column",
    "margin-left": 5,
  },
  avatar: {
    width: 30,
    height: 30,
  },
});

interface IToolbarUser {
  annotation: IAnnotation;
}

const ToolbarUser = ({ annotation }: IToolbarUser) => {
  const classes = useStyles({});
  const annotationUser = annotation.user;
  if (!annotationUser) return null;
  const isUpdated = !!annotation.data.dateUpdated;
  const dateRecent = isUpdated
    ? annotation.data.dateUpdated
    : annotation.data.dateCreated;
  return (
    <div className={classes.toolbar}>
      <Avatar className={classes.avatar} src={annotationUser.picture} />

      <div className={classes.textContainer}>
        <TypographyEllipsis
          variant="body2"
          children={`${annotationUser.firstName} ${annotationUser.lastName}`}
        />
        {!dateRecent ? null : (
          <TypographyEllipsis
            variant="body1"
            style={{ color: "#ccc", lineHeight: 1 }}
            children={`${moment(dateRecent).format("DD/MM/YYYY HH:mm")} ${
              isUpdated ? "(edited)" : ""
            }`}
          />
        )}
      </div>
    </div>
  );
};

export default ToolbarUser;
