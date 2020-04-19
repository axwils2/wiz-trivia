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
  const object = incorrectAnswerPenaltyLabels.find(
    label => label.value === incorrectAnswerPenaltyType
  );

  return object ? object.label : "";
};

export const questionAnswerFormatLabel = (
  questionAnswerFormatType: QuestionAnswerFormatType
) => {
  const object = questionAnswerFormatLabels.find(
    label => label.value === questionAnswerFormatType
  );

  return object ? object.label : "";
};

export const questionWagerFormatLabel = (
  questionWagerFormatType: QuestionWagerFormatType
) => {
  const object = questionWagerFormatLabels.find(
    label => label.value === questionWagerFormatType
  );

  return object ? object.label : "";
};
