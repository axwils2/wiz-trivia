// @flow
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import toLower from "lodash/toLower";

import { firestore } from "components/Firebase";
import {
  incorrectAnswerPenaltyLabels,
  questionFormatLabels
} from "constants/userFriendlyLabels";
import { docDataWithId } from "functions/firestoreHelpers";
import type { QuestionType } from "types/QuestionTypes";

const useStyles = makeStyles({
  formatRadioSection: {
    marginRight: "40px"
  }
});

const NewQuestionForm = ({
  match,
  newOrderValue,
  afterCreate
}: {
  match: *,
  newOrderValue: number,
  afterCreate: (question: QuestionType) => void
}) => {
  const classes = useStyles();
  const [body, setBody] = useState("");
  const [answer, setAnswer] = useState("");
  const [format, setFormat] = useState(null);
  const [incorrectAnswerPenalty, setIncorrectAnswerPenalty] = useState(null);
  const [optionsString, setOptionsString] = useState("");
  const optionsRequired = ["multipleChoice", "placeInOrder"].includes(format);
  const invalid =
    body === "" ||
    answer === "" ||
    !format ||
    !incorrectAnswerPenalty ||
    (optionsRequired && optionsString === "");
  const triviaSessionUid = match.params.triviaSessionUid;
  const categoryUid = match.params.categoryUid;

  const createQuestion = () => {
    const options = optionsRequired ? optionsString.split(", ") : [];
    firestore
      .questions(triviaSessionUid, categoryUid)
      .add({
        body,
        bodyInsensitive: toLower(body),
        createdAt: firestore.timestamp().now(),
        order: newOrderValue || 0,
        answer,
        format,
        incorrectAnswerPenalty,
        options,
        categoryUid,
        triviaSessionUid
      })
      .then(docRef => {
        docRef.get().then(doc => {
          const question = docDataWithId(doc);

          afterCreate(question);
        });
      });
  };

  return (
    <Container maxWidth={"sm"}>
      <Typography variant={"h6"}>Create New Question</Typography>
      <TextField
        id={"body"}
        label="Body"
        variant="outlined"
        onChange={e => setBody(e.target.value)}
        margin={"normal"}
        value={body}
        fullWidth
        multiline
        rows={"4"}
      />
      <TextField
        id={"answer"}
        label="Answer"
        variant="outlined"
        onChange={e => setAnswer(e.target.value)}
        margin={"normal"}
        value={answer}
        fullWidth
      />
      <FormControl component="fieldset" className={classes.formatRadioSection}>
        <FormLabel component="legend">Format</FormLabel>
        <RadioGroup
          aria-label="format"
          name="format"
          value={format}
          onChange={e => setFormat(e.target.value)}
        >
          {questionFormatLabels.map(labelObject => (
            <FormControlLabel
              key={labelObject.value}
              value={labelObject.value}
              control={<Radio />}
              label={labelObject.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel component="legend">Incorrect Answer Penalty</FormLabel>
        <RadioGroup
          aria-label="incorrectAnswerPenalty"
          name="incorrectAnswerPenalty"
          value={incorrectAnswerPenalty}
          onChange={e => setIncorrectAnswerPenalty(e.target.value)}
        >
          {incorrectAnswerPenaltyLabels.map(labelObject => (
            <FormControlLabel
              key={labelObject.value}
              value={labelObject.value}
              control={<Radio />}
              label={labelObject.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {optionsRequired && (
        <TextField
          id={"options"}
          label="Options (Comma + Space Separated)"
          variant="outlined"
          onChange={e => setOptionsString(e.target.value)}
          margin={"normal"}
          value={optionsString}
          fullWidth
        />
      )}
      <Button
        disabled={invalid}
        variant={"contained"}
        onClick={createQuestion}
        size={"large"}
        fullWidth
      >
        Create
      </Button>
    </Container>
  );
};

export default withRouter(NewQuestionForm);
