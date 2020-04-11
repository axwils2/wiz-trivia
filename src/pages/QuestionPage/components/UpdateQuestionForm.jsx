// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import toLower from "lodash/toLower";

import { firestore } from "components/Firebase";
import type { QuestionType } from "types/QuestionTypes";

const useStyles = makeStyles({
  formatRadioSection: {
    marginRight: "40px"
  }
});

const UpdateQuestionForm = ({
  question,
  triviaSessionUid,
  categoryUid
}: {
  question: QuestionType,
  triviaSessionUid: string,
  categoryUid: string
}) => {
  const classes = useStyles();
  const [body, setBody] = useState(question.body);
  const [answer, setAnswer] = useState(question.answer);
  const [format, setFormat] = useState(question.format);
  const [incorrectAnswerPenalty, setIncorrectAnswerPenalty] = useState(
    question.incorrectAnswerPenalty
  );
  const [optionsString, setOptionsString] = useState(
    question.options.join(", ")
  );
  const optionsRequired = ["multipleChoice", "placeInOrder"].includes(format);
  const invalid =
    body === "" ||
    answer === "" ||
    !format ||
    !incorrectAnswerPenalty ||
    (optionsRequired && optionsString === "");

  const updateQuestion = () => {
    const options = optionsRequired ? optionsString.split(", ") : [];

    firestore.question(triviaSessionUid, categoryUid, question.uid).update({
      body,
      bodyInsensitive: toLower(body),
      answer,
      format,
      incorrectAnswerPenalty,
      options
    });
  };

  return (
    <Box marginBottom={"48px"}>
      <Typography variant={"h4"}>Question Details</Typography>
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
      <Box>
        <FormControl
          component="fieldset"
          className={classes.formatRadioSection}
        >
          <FormLabel component="legend">Format</FormLabel>
          <RadioGroup
            aria-label="format"
            name="format"
            value={format}
            onChange={e => setFormat(e.target.value)}
          >
            <FormControlLabel
              value="openResponse"
              control={<Radio />}
              label="Open Response"
            />
            <FormControlLabel
              value="multipleChoice"
              control={<Radio />}
              label="Mulitple Choice"
            />
            <FormControlLabel
              value="placeInOrder"
              control={<Radio />}
              label="Place In Order"
            />
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
            <FormControlLabel
              value="zeroPoints"
              control={<Radio />}
              label="No Change To Total Points"
            />
            <FormControlLabel
              value="negativePoints"
              control={<Radio />}
              label="Reduce Total Points By Wager Amount"
            />
          </RadioGroup>
        </FormControl>
      </Box>
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
        color={"primary"}
        onClick={updateQuestion}
        size={"large"}
        style={{ float: "right" }}
      >
        Update
      </Button>
    </Box>
  );
};

export default UpdateQuestionForm;
