import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AvatarMaterial from "@material-ui/core/Avatar";

const useStyles = makeStyles({
  divAvatar: {
    justifyContent: "center",
    display: "flex",
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    "background-color": "#eee",
  },
});

interface IAvatar {
  src: string;
}

const Avatar = ({ src }: IAvatar) => {
  const classes = useStyles({});

  return (
    <div className={classes.divAvatar}>
      <AvatarMaterial src={src} className={classes.avatar} />
    </div>
  );
};

export default Avatar;
