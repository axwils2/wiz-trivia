// @flow
export type QuestionAnswerFormatType =
  | "openResponse"
  | "openResponseList"
  | "multipleChoice"
  | "dragDropList";

export type QuestionIncorrectAnswerPenaltyType =
  | "zeroPoints"
  | "negativePoints";

export type QuestionWagerFormatType = "slider" | "multipleChoice" | "hidden";
export type QuestionType = {
  uid: string,
  body: string,
  bodyInsensitive: string,
  order: number,
  createdAt: Date,
  answer: string,
  answerFormat: QuestionAnswerFormatType,
  incorrectAnswerPenalty: QuestionIncorrectAnswerPenaltyType,
  options: Array<string>,
  timerOn?: boolean,
  timerEnd?: Date,
  categoryUid: string,
  triviaSessionUid: string,
  wagerFormat: QuestionWagerFormatType,
  defaultWager: ?number,
  maxWager: ?number,
  minWager: ?number,
  openResponseListCount: number,
  correctGifUrl: ?string,
  incorrectGifUrl: ?string
};
