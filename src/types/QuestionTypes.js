// @flow
export type QuestionFormatType =
  | "openResponse"
  | "multipleChoice"
  | "placeInOrder";

export type QuestionIncorrectAnswerPenaltyType =
  | "zeroPoints"
  | "negativePoints";
export type QuestionType = {
  uid: string,
  body: string,
  bodyInsensitive: string,
  order: number,
  createdAt: Date,
  answer: string,
  format: QuestionFormatType,
  incorrectAnswerPenalty: QuestionIncorrectAnswerPenaltyType,
  options: Array<string>,
  categoryUid: string,
  triviaSessionUid: string
};
