// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

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
    padding: theme.spacing(8)
  }
}));

const SessionInfoModal = ({ accessCode }: { accessCode: string }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Button
        size={"small"}
        variant={"contained"}
        color={"primary"}
        onClick={handleOpen}
      >
        Show Session Info
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
            <Typography variant={"h2"} display={"block"} gutterBottom>
              Website: <b>{process.env.REACT_APP_ROOT_URL}</b>
            </Typography>
            <Typography variant={"h2"} display={"block"}>
              Access Code: <b>{accessCode}</b>
            </Typography>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default SessionInfoModal;
