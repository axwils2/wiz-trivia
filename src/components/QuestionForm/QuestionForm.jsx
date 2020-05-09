// @flow
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";
import toLower from "lodash/toLower";

import { firestore } from "components/Firebase";
import {
  incorrectAnswerPenaltyLabels,
  questionAnswerFormatLabels,
  questionWagerFormatLabels
} from "constants/userFriendlyLabels";
import { docDataWithId } from "functions/firestoreHelpers";
import type { QuestionType } from "types/QuestionTypes";
import GiphySearch from "components/GiphySearch";

const useStyles = makeStyles({
  flexSection: {
    display: "flex",
    justifyContent: "space-between"
  },
  flexSectionHalf: {
    width: "49%"
  },
  answerFormatRadioSection: {
    marginRight: "16px",
    minWidth: "176px"
  },
  wagerTextField: {
    marginLeft: "8px"
  },
  divider: {
    margin: "16px auto"
  },
  submitButton: {
    marginTop: "16px"
  }
});

const QuestionForm = ({
  triviaSessionUid,
  categoryUid,
  newOrderValue,
  afterSubmit,
  question
}: {
  triviaSessionUid: string,
  categoryUid: string,
  newOrderValue?: number,
  afterSubmit: (question: QuestionType) => void,
  question?: QuestionType
}) => {
  const classes = useStyles();
  const [body, setBody] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerFormat, setAnswerFormat] = useState(null);
  const [incorrectAnswerPenalty, setIncorrectAnswerPenalty] = useState(null);
  const [optionsString, setOptionsString] = useState("");
  const [wagerFormat, setWagerFormat] = useState(null);
  const [defaultWager, setDefaultWager] = useState(0);
  const [minWager, setMinWager] = useState(undefined);
  const [maxWager, setMaxWager] = useState(undefined);
  const [correctGifUrl, setCorrectGifUrl] = useState(null);
  const [incorrectGifUrl, setIncorrectGifUrl] = useState(null);
  const [openResponseListCount, setOpenResponseListCount] = useState(1);
  const newQuestion = !question;
  const optionsRequired = ["multipleChoice", "dragDropList"].includes(
    answerFormat
  );

  useEffect(
    () => {
      if (!question) return;

      setBody(question.body);
      setAnswer(question.answer);
      setAnswerFormat(question.answerFormat);
      setIncorrectAnswerPenalty(question.incorrectAnswerPenalty);
      setOptionsString(question.options.join(", "));
      setWagerFormat(question.wagerFormat);
      setDefaultWager(question.defaultWager);
      setMinWager(question.minWager);
      setMaxWager(question.maxWager);
      setCorrectGifUrl(question.correctGifUrl);
      setIncorrectGifUrl(question.incorrectGifUrl);
      setOpenResponseListCount(question.openResponseListCount || 1);
    },
    [question]
  );

  const onSubmit = () => {
    if (newQuestion) {
      createQuestion();
    } else {
      updateQuestion();
    }
  };

  const updateQuestion = () => {
    if (newQuestion || !question) return;

    const options = optionsRequired ? optionsString.split(", ") : [];
    const questionRef = firestore.question(
      triviaSessionUid,
      categoryUid,
      question.uid
    );
    questionRef
      .update({
        body,
        bodyInsensitive: toLower(body),
        answer,
        answerFormat,
        incorrectAnswerPenalty,
        options,
        wagerFormat,
        defaultWager,
        minWager,
        maxWager,
        correctGifUrl,
        incorrectGifUrl,
        openResponseListCount
      })
      .then(() => {
        questionRef.get().then(doc => {
          const updatedQuestion = docDataWithId(doc);

          afterSubmit(updatedQuestion);
        });
      });
  };

  const createQuestion = () => {
    if (!newQuestion) return;

    const options = optionsRequired ? optionsString.split(", ") : [];
    firestore
      .questions(triviaSessionUid, categoryUid)
      .add({
        body,
        bodyInsensitive: toLower(body),
        createdAt: firestore.timestamp().now(),
        order: newOrderValue || 0,
        answer,
        answerFormat,
        incorrectAnswerPenalty,
        options,
        wagerFormat,
        defaultWager,
        minWager,
        maxWager,
        correctGifUrl,
        incorrectGifUrl,
        openResponseListCount,
        categoryUid,
        triviaSessionUid
      })
      .then(docRef => {
        docRef.get().then(doc => {
          const createdQuestion = docDataWithId(doc);

          afterSubmit(createdQuestion);
        });
      });
  };

  const invalid = () => {
    return (
      body === "" ||
      answer === "" ||
      !answerFormat ||
      !incorrectAnswerPenalty ||
      !wagerFormat ||
      (optionsRequired && optionsString === "") ||
      (minWager !== null &&
        minWager !== undefined &&
        maxWager !== null &&
        maxWager !== undefined &&
        minWager >= maxWager) ||
      defaultWager === null ||
      defaultWager === undefined ||
      defaultWager < 0 ||
      !openResponseListCount ||
      (["multipleChoice", "slider"].includes(wagerFormat) &&
        (minWager === null ||
          minWager === undefined ||
          maxWager === null ||
          maxWager === undefined))
    );
  };

  return (
    <Box>
      <Typography variant={"h6"}>
        {newQuestion ? "Create New" : "Update"} Question
      </Typography>
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
      <Divider className={classes.divider} />
      <Box className={classes.flexSection}>
        <Box className={classes.flexSectionHalf}>
          <FormControl
            component="fieldset"
            className={classes.answerFormatRadioSection}
          >
            <FormLabel component="legend">Answer Format</FormLabel>
            <RadioGroup
              aria-label="answer format"
              name="answerFormat"
              value={answerFormat}
              onChange={e => setAnswerFormat(e.target.value)}
            >
              {questionAnswerFormatLabels.map(labelObject => (
                <FormControlLabel
                  key={labelObject.value}
                  value={labelObject.value}
                  control={<Radio />}
                  label={labelObject.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        <Box className={classes.flexSectionHalf}>
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
              margin={"normal"}
              onChange={e => setOptionsString(e.target.value)}
              value={optionsString}
              fullWidth
            />
          )}
          {answerFormat === "openResponseList" && (
            <TextField
              id={"openResponseListCount"}
              label="Number Of Text Fields"
              variant="outlined"
              type={"number"}
              margin={"normal"}
              onChange={e => setOpenResponseListCount(parseInt(e.target.value))}
              value={openResponseListCount}
            />
          )}
        </Box>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.flexSection}>
        <Box className={classes.flexSectionHalf}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Wager Format</FormLabel>
            <RadioGroup
              aria-label="Wager Format"
              name="wagerFormat"
              value={wagerFormat}
              onChange={e => setWagerFormat(e.target.value)}
            >
              {questionWagerFormatLabels.map(labelObject => (
                <FormControlLabel
                  key={labelObject.value}
                  value={labelObject.value}
                  control={<Radio />}
                  label={labelObject.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        <Box className={classes.flexSectionHalf}>
          <FormLabel component="legend">Wager Amounts</FormLabel>
          <Box className={classes.flexSection}>
            <TextField
              type={"number"}
              label={"Default"}
              name={"defaultWager"}
              variant={"outlined"}
              onChange={e => setDefaultWager(parseInt(e.target.value))}
              margin={"normal"}
              value={defaultWager}
            />
            <TextField
              type={"number"}
              label={"Min"}
              name={"minWager"}
              variant={"outlined"}
              onChange={e => setMinWager(parseInt(e.target.value))}
              margin={"normal"}
              className={classes.wagerTextField}
              value={minWager}
            />
            <TextField
              type={"number"}
              label={"Max"}
              name={"maxWager"}
              variant={"outlined"}
              onChange={e => setMaxWager(parseInt(e.target.value))}
              margin={"normal"}
              className={classes.wagerTextField}
              value={maxWager}
            />
          </Box>
        </Box>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.flexSection}>
        <Box className={classes.flexSectionHalf}>
          <FormLabel component="legend">Correct GIF</FormLabel>
          <GiphySearch
            id={"correctGifUrl"}
            onGifSelect={setCorrectGifUrl}
            gifUrl={correctGifUrl}
          />
        </Box>
        <Box className={classes.flexSectionHalf}>
          <FormLabel component="legend">Incorrect GIF</FormLabel>
          <GiphySearch
            id={"incorrectGifUrl"}
            onGifSelect={setIncorrectGifUrl}
            gifUrl={incorrectGifUrl}
          />
        </Box>
      </Box>
      <Button
        disabled={invalid()}
        variant={"contained"}
        onClick={onSubmit}
        className={classes.submitButton}
        size={"large"}
        color={"primary"}
        fullWidth
      >
        Submit
      </Button>
    </Box>
  );
};

export default QuestionForm;
