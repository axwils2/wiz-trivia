// @flow
import {
  incorrectAnswerPenaltyLabels,
  questionAnswerFormatLabels,
  questionWagerFormatLabels
} from "constants/userFriendlyLabels";

import type {
  QuestionIncorrectAnswerPenaltyType,
  QuestionAnswerFormatType,
  QuestionWagerFormatType
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

export const questionWagerFormatLabel = (
  questionWagerFormatType: QuestionWagerFormatType
) => {
  return questionWagerFormatLabels.find(
    label => label.value === questionWagerFormatType
  ).label;
};
