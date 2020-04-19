// @flow
import {
  incorrectAnswerPenaltyLabels,
  questionAnswerFormatLabels
} from "constants/userFriendlyLabels";

import type {
  QuestionIncorrectAnswerPenaltyType,
  QuestionAnswerFormatType
} from "types/QuestionTypes";

export const incorrectAnswerPenaltyLabel = (
  incorrectAnswerPenaltyType: QuestionIncorrectAnswerPenaltyType
) => {
  return incorrectAnswerPenaltyLabels.find(
    label => label.value === incorrectAnswerPenaltyType
  ).label;
};

export const questionAnswerFormatLabel = (
  questionAnswerFormatType: QuestionAnswerFormatType
) => {
  return questionAnswerFormatLabels.find(
    label => label.value === questionAnswerFormatType
  ).label;
};
