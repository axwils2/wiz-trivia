// @flow
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
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
import words from "lodash/words";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import type { QuestionType } from "types/QuestionTypes";

const NewQuestionForm = ({
  match,
  newOrderValue,
  afterCreate
}: {
  match: *,
  newOrderValue: number,
  afterCreate: (question: QuestionType) => {}
}) => {
  const [body, setBody] = useState("");
  const [answer, setAnswer] = useState("");
  const [format, setFormat] = useState(null);
  const [optionsString, setOptionsString] = useState("");
  const optionsRequired = ["multipleChoice", "placeInOrder"].includes(format);
  const invalid =
    body === "" ||
    answer === "" ||
    !format ||
    (optionsRequired && optionsString === "");
  const triviaSessionUid = match.params.triviaSessionUid;
  const categoryUid = match.params.categoryUid;

  const createQuestion = () => {
    const options = optionsRequired ? words(optionsString, /[^, ]+/g) : [];
    firestore
      .questions(triviaSessionUid, categoryUid)
      .add({
        body,
        bodyInsensitive: toLower(body),
        createdAt: firestore.timestamp(),
        order: newOrderValue || 0,
        answer,
        format,
        options
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
      <FormControl component="fieldset">
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
