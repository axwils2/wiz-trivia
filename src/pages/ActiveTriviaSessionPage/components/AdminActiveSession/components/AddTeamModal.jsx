// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import toUpper from "lodash/toUpper";

import { firestore } from "components/Firebase";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

const AddTeamModal = ({ triviaSessionUid }: { triviaSessionUid: string }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const invalid = name === "";
  const classes = useStyles();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const addTeam = () => {
    firestore
      .teams(triviaSessionUid)
      .add({
        name: name,
        pointsTotal: 0,
        answers: []
      })
      .then(() => {
        setName("");
      });
  };

  return (
    <>
      <Button
        size={"small"}
        variant={"contained"}
        color={"primary"}
        onClick={handleOpen}
      >
        Add Team
      </Button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Container maxWidth={"sm"}>
              <Typography variant={"h6"}>Add Team</Typography>
              <TextField
                id={"name"}
                label="Name"
                variant="outlined"
                onChange={e => setName(toUpper(e.target.value))}
                margin={"normal"}
                value={name}
                fullWidth
              />
              <Button
                disabled={invalid}
                variant={"contained"}
                onClick={addTeam}
                size={"large"}
                fullWidth
              >
                Add
              </Button>
            </Container>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default AddTeamModal;
