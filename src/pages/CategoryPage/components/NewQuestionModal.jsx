// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import NewQuestionForm from "./NewQuestionForm";
import type { QuestionType } from "types/QuestionTypes";

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

const NewQuestionModal = ({
  newOrderValue,
  afterQuestionCreate
}: {
  newOrderValue: number,
  afterQuestionCreate: (question: QuestionType) => void
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const afterCreate = (question: QuestionType) => {
    if (!question) return null;

    handleClose();
    afterQuestionCreate(question);
  };

  return (
    <>
      <Button variant={"contained"} color={"primary"} onClick={handleOpen}>
        Create New Question
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
            <NewQuestionForm
              newOrderValue={newOrderValue}
              afterCreate={afterCreate}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default NewQuestionModal;
