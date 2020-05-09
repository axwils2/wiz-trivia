// @flow
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import type { LeaderBoardType } from "types/TriviaSessionTypes";

const useStyles = makeStyles({
  list: {
    width: 250
  },
  noGrow: {
    flexGrow: 0,
    marginRight: "8px",
    marginLeft: "8px"
  }
});

const LeaderBoardSideDrawer = ({
  open,
  onClose,
  leaderBoard
}: {
  open: boolean,
  onClose: () => void,
  leaderBoard: LeaderBoardType
}) => {
  const classes = useStyles();

  return (
    <Drawer anchor={"left"} open={open} onClose={onClose}>
      <div className={classes.list} role={"presentation"} onClick={onClose}>
        <List>
          <ListItem divider>
            <ListItemText primary={"Leader Board"} />
          </ListItem>
          {leaderBoard.map(({ name, pointsTotal }, index) => (
            <ListItem divider key={name}>
              <ListItemText
                primary={`${index + 1}.`}
                className={classes.noGrow}
              />
              <ListItemText primary={name} />
              <ListItemText primary={pointsTotal} className={classes.noGrow} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default LeaderBoardSideDrawer;
