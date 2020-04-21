// @flow
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
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
import * as ROUTES from "constants/routes";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  logoTitleContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: props => (props.authUser ? "left" : "center")
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    alignItems: "center"
  },
  logo: {
    width: "32px",
    height: "32px",
    marginRight: theme.spacing(1)
  }
}));

const AppBar = () => {
  const [open, setOpen] = useState(false);
  const authUser = useContext(AuthUserContext);
  const classes = useStyles({ authUser: authUser });

  return (
    <div className={"root"}>
      <MUIAppBar position={"static"}>
        <Container maxWidth={"md"}>
          <Toolbar disableGutters>
            {authUser && (
              <IconButton
                edge={"start"}
                color={"inherit"}
                aria-label={"menu"}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <div className={classes.logoTitleContainer}>
              <Link to={ROUTES.LANDING} className={classes.link}>
                <img
                  src={"logo192.png"}
                  className={classes.logo}
                  alt={"Trivia Wiz"}
                />
                <Typography variant={"h6"}>Trivia Wiz</Typography>
              </Link>
            </div>
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
