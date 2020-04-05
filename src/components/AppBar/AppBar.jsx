// @flow
import React, { useContext, useState } from "react";
import { AppBar as MUIAppBar } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

import { doSignOut } from "components/Firebase/auth";
import { AuthUserContext } from "components/Session";
import SideDrawer from "./SideDrawer";

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
  const [open, setOpen] = useState(false);
  const authUser = useContext(AuthUserContext);
  const classes = useStyles();

  return (
    <div className={"root"}>
      <MUIAppBar position={"static"}>
        <Container maxWidth={"md"}>
          <Toolbar disableGutters>
            {authUser && (
              <IconButton
                edge={"start"}
                className={classes.menuButton}
                color={"inherit"}
                aria-label={"menu"}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant={"h6"}
              className={classes.title}
              align={authUser ? "left" : "center"}
            >
              Wiz Trivia
            </Typography>
            {authUser && (
              <Button color={"inherit"} onClick={doSignOut}>
                Logout
              </Button>
            )}
          </Toolbar>
        </Container>
      </MUIAppBar>
      <SideDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AppBar;
