// @flow
import React, { useContext } from "react";
import { AppBar as MUIAppBar } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

import { doSignOut } from "components/Firebase/auth";
import { AuthUserContext } from "components/Session";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

const AppBar = () => {
  const authUser = useContext(AuthUserContext);
  const classes = useStyles();

  return (
    <MUIAppBar position={"static"}>
      <Toolbar>
        {authUser && (
          <IconButton
            edge={"start"}
            className={classes.menuButton}
            color={"inherit"}
            aria-label={"menu"}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant={"h6"} className={classes.title}>
          Wiz Trivia
        </Typography>
        {authUser && (
          <Button color={"inherit"} onClick={doSignOut}>
            Logout
          </Button>
        )}
      </Toolbar>
    </MUIAppBar>
  );
};

export default AppBar;
