// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Slider from "@material-ui/core/Slider";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import type { TeamAnswerType } from "types/TeamTypes";
import type { QuestionType, QuestionFormatType } from "types/QuestionTypes";
import type { CategoryType, CategoryWagerType } from "types/CategoryTypes";

type AnswerSectionProps = {
  answer: TeamAnswerType,
  updateAnswer: (update: $Shape<TeamAnswerType>) => void,
  currentQuestion: QuestionType,
  currentCategory: CategoryType,
  previousCategoryWagerAmounts: Array<number>
};

type AnswerFormProps = {
  options: Array<string>,
  answer: TeamAnswerType,
  updateAnswer: (update: $Shape<TeamAnswerType>) => void,
  questionFormat: QuestionFormatType
};

type WagerFormProps = {
  wagerAmount: ?number,
  updateAnswer: (update: $Shape<TeamAnswerType>) => void,
  wagerType: CategoryWagerType,
  previousCategoryWagerAmounts: Array<number>
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
  answer,
  updateAnswer,
  questionFormat
}: AnswerFormProps) => {
  const classes = useStyles();

  if (questionFormat === "multipleChoice") {
    return (
      <RadioGroup
        aria-label="body"
        name="body"
        value={answer.body}
        onChange={e => updateAnswer({ body: e.target.value })}
      >
        {options.map(option => (
          <FormControlLabel
            key={`radio-body-${option}`}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    );
  } else if (questionFormat === "placeInOrder") {
    return (
      <Droppable droppableId={"answer"}>
        {provided => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
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
        id={"answer"}
        label="Answer"
        variant="outlined"
        onChange={e => updateAnswer({ body: e.target.value })}
        margin={"normal"}
        defaultValue={answer.body}
        fullWidth
      />
    );
  }
};

const WagerForm = ({
  wagerAmount,
  updateAnswer,
  wagerType,
  previousCategoryWagerAmounts
}: WagerFormProps) => {
  const classes = useStyles();

  if (wagerType === "oneThroughSix") {
    return (
      <RadioGroup
        aria-label="wagerAmount"
        name="wagerAmount"
        value={wagerAmount}
        onChange={e => updateAnswer({ wagerAmount: parseInt(e.target.value) })}
        className={classes.radioGroup}
      >
        {[1, 2, 3, 4, 5, 6].map(value => (
          <FormControlLabel
            key={`radio-wagerAmount-${value}`}
            value={value}
            control={<Radio />}
            label={value}
            disabled={previousCategoryWagerAmounts.includes(value)}
          />
        ))}
      </RadioGroup>
    );
  } else if (wagerType === "upToTwentyFive") {
    return (
      <Box width={"96%"} margin={"0 auto"}>
        <Slider
          defaultValue={0}
          aria-labelledby="discrete-slider-always"
          step={1}
          max={25}
          onChange={(_e, value) => updateAnswer({ wagerAmount: value })}
          marks={[{ value: 0, label: "0" }, { value: 25, label: "25" }]}
          valueLabelDisplay="on"
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
            answer={answer}
            updateAnswer={updateAnswer}
            questionFormat={currentQuestion.format}
            options={options}
          />
        </DragDropContext>
      </Box>
      {["oneThroughSix", "upToTwentyFive"].includes(
        currentCategory.wagerType
      ) && <Typography variant={"overline"}>Wager Amount:</Typography>}
      <WagerForm
        wagerAmount={answer.wagerAmount}
        updateAnswer={updateAnswer}
        wagerType={currentCategory.wagerType}
        previousCategoryWagerAmounts={previousCategoryWagerAmounts}
      />
    </Box>
  );
};

export default AnswerSection;
