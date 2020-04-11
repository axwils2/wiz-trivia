// @flow
import {
  categoryWagerLabels,
  incorrectAnswerPenaltyLabels,
  questionFormatLabels
} from "constants/userFriendlyLabels";
import { CategoryWagerType } from "types/CategoryTypes";
import {
  QuestionIncorrectAnswerPenaltyType,
  QuestionFormatType
} from "types/QuestionTypes";

export const categoryWagerLabel = (categoryWagerType: CategoryWagerType) => {
  return categoryWagerLabels.find(label => label.value === categoryWagerType)
    .label;
};

export const incorrectAnswerPenaltyLabel = (
  incorrectAnswerPenaltyType: QuestionIncorrectAnswerPenaltyType
) => {
  return incorrectAnswerPenaltyLabels.find(
    label => label.value === incorrectAnswerPenaltyType
  ).label;
};

export const questionFormatLabel = (questionFormatType: QuestionFormatType) => {
  return questionFormatLabels.find(label => label.value === questionFormatType)
    .label;
};
