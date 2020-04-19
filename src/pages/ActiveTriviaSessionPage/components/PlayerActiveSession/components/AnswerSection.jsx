// @flow
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Slider from "@material-ui/core/Slider";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import range from "lodash/range";

import type { TeamAnswerType, TeamAnswerStatusType } from "types/TeamTypes";
import type {
  QuestionType,
  QuestionAnswerFormatType,
  QuestionWagerFormatType
} from "types/QuestionTypes";
import type { CategoryType } from "types/CategoryTypes";

type AnswerSectionProps = {
  answer: TeamAnswerType,
  updateAnswer: (update: $Shape<TeamAnswerType>) => void,
  currentQuestion: QuestionType,
  currentCategory: CategoryType,
  previousCategoryWagerAmounts: Array<number>
};

type AnswerFormProps = {
  options: Array<string>,
  answerBody: string,
  updateAnswer: (update: $Shape<TeamAnswerType>) => void,
  questionAnswerFormat: QuestionAnswerFormatType,
  questionUid: string
};

type WagerFormProps = {
  wagerAmount: ?number,
  updateAnswer: (update: $Shape<TeamAnswerType>) => void,
  wagerFormat: QuestionWagerFormatType,
  previousCategoryWagerAmounts: Array<number>,
  status: TeamAnswerStatusType,
  repeatWagersDisabled: boolean,
  minWager: ?number,
  maxWager: ?number
};

const useStyles = makeStyles(theme => ({
  radioGroup: {
    flexDirection: "row"
  },
  draggable: {
    width: "100%",
    padding: "16px",
    borderRadius: "4px",
    border: "1px solid silver",
    marginBottom: "8px",
    backgroundColor: theme.palette.background.paper
  }
}));

const AnswerForm = ({
  options,
  answerBody,
  updateAnswer,
  questionAnswerFormat,
  questionUid
}: AnswerFormProps) => {
  const classes = useStyles();

  if (questionAnswerFormat === "multipleChoice") {
    return (
      <RadioGroup
        aria-label="body"
        name="body"
        value={answerBody}
        onChange={e => updateAnswer({ body: e.target.value })}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={`radio-body-${option}-${index}`}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    );
  } else if (questionAnswerFormat === "dragDropList") {
    return (
      <Droppable droppableId={"answer"}>
        {provided => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            <Typography variant={"subtitle1"}>
              Drag and drop the list below:
            </Typography>
            {options.map((option, index) => (
              <Draggable draggableId={option} index={index} key={option}>
                {providedDraggable => (
                  <Box
                    {...providedDraggable.draggableProps}
                    {...providedDraggable.dragHandleProps}
                    ref={providedDraggable.innerRef}
                    className={classes.draggable}
                  >
                    <Typography variant={"subtitle2"}>{option}</Typography>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    );
  } else {
    return (
      <TextField
        id={`answer-for-${questionUid}`}
        name={`answer-for-${questionUid}`}
        label="Answer"
        variant="outlined"
        onChange={e => updateAnswer({ body: e.target.value })}
        value={answerBody}
        margin={"normal"}
        fullWidth
      />
    );
  }
};

const WagerForm = ({
  wagerAmount,
  updateAnswer,
  wagerFormat,
  previousCategoryWagerAmounts,
  status,
  repeatWagersDisabled,
  minWager,
  maxWager
}: WagerFormProps) => {
  const classes = useStyles();
  const safeRadioMinWager =
    minWager === null || minWager === undefined ? 1 : minWager;
  const safeRadioMaxWager =
    maxWager === null || maxWager === undefined ? 6 : maxWager;
  const safeSliderMinWager =
    minWager === null || minWager === undefined ? 0 : minWager;
  const safeSliderMaxWager =
    maxWager === null || maxWager === undefined ? 25 : maxWager;

  if (wagerFormat === "multipleChoice") {
    return (
      <RadioGroup
        aria-label="wagerAmount"
        name="wagerAmount"
        value={wagerAmount}
        onChange={e => updateAnswer({ wagerAmount: parseInt(e.target.value) })}
        className={classes.radioGroup}
      >
        {range(safeRadioMinWager, safeRadioMaxWager + 1).map(value => (
          <FormControlLabel
            key={`radio-wagerAmount-${value}`}
            value={value}
            control={<Radio />}
            label={value}
            disabled={
              (repeatWagersDisabled &&
                previousCategoryWagerAmounts.includes(value)) ||
              status === "refreshed"
            }
          />
        ))}
      </RadioGroup>
    );
  } else if (wagerFormat === "slider") {
    return (
      <Box width={"96%"} margin={"24px auto 0"}>
        <Slider
          value={wagerAmount || 0}
          aria-labelledby="discrete-slider-always"
          step={1}
          max={safeSliderMaxWager}
          min={safeSliderMinWager}
          onChange={(_e, value) => updateAnswer({ wagerAmount: value })}
          marks={[
            { value: safeSliderMinWager, label: safeSliderMinWager },
            { value: safeSliderMaxWager, label: safeSliderMaxWager }
          ]}
          valueLabelDisplay="on"
          disabled={status === "refreshed"}
        />
      </Box>
    );
  } else {
    return null;
  }
};

const AnswerSection = (props: AnswerSectionProps) => {
  const {
    answer,
    updateAnswer,
    currentQuestion,
    currentCategory,
    previousCategoryWagerAmounts
  } = props;
  const [options, setOptions] = useState(currentQuestion.options);

  useEffect(
    () => {
      setOptions(currentQuestion.options);
    },
    [currentQuestion]
  );

  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (destination.index === source.index) return;

    const safeOptions = Array.from(options);
    safeOptions.splice(source.index, 1);
    safeOptions.splice(destination.index, 0, draggableId);

    setOptions(safeOptions);
    updateAnswer({ body: safeOptions.join(", ") });
  };

  return (
    <Box>
      <Box marginBottom={"24px"}>
        <DragDropContext onDragEnd={onDragEnd}>
          <AnswerForm
            answerBody={answer.body || ""}
            updateAnswer={updateAnswer}
            questionAnswerFormat={currentQuestion.answerFormat}
            options={options}
            questionUid={currentQuestion.uid}
          />
        </DragDropContext>
      </Box>
      {["multipleChoice", "slider"].includes(currentQuestion.wagerFormat) && (
        <Typography variant={"overline"}>Wager Amount:</Typography>
      )}
      <WagerForm
        wagerAmount={answer.wagerAmount}
        updateAnswer={updateAnswer}
        wagerFormat={currentQuestion.wagerFormat}
        previousCategoryWagerAmounts={previousCategoryWagerAmounts}
        repeatWagersDisabled={currentCategory.repeatWagersDisabled}
        minWager={currentQuestion.minWager}
        maxWager={currentQuestion.maxWager}
        status={answer.status}
      />
    </Box>
  );
};

export default AnswerSection;
