// @flow
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles({
  list: {
    width: 250
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
          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Account"} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default SideDrawer;
