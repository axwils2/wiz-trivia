// @flow
import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import FolderIcon from "@material-ui/icons/Folder";

import * as ROUTES from "constants/routes";

const useStyles = makeStyles({
  list: {
    width: 250
  },
  link: {
    color: "inherit",
    textDecoration: "none"
  }
});

const SideDrawer = ({
  open,
  onClose
}: {
  open: boolean,
  onClose: () => void
}) => {
  const classes = useStyles();

  return (
    <Drawer anchor={"left"} open={open} onClose={onClose}>
      <div className={classes.list} role={"presentation"} onClick={onClose}>
        <List>
          <Link to={ROUTES.TRIVIA_SESSIONS} className={classes.link}>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={"Sessions"} />
            </ListItem>
          </Link>
          <Divider />
          <Link to={ROUTES.ACCOUNT} className={classes.link}>
            <ListItem button>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={"Account"} />
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  );
};

export default SideDrawer;
