// @flow
export type QuestionFormatType =
  | "openResponse"
  | "multipleChoice"
  | "placeInOrder";
export type QuestionType = {
  uid: string,
  body: string,
  bodyInsensitive: string,
  order: number,
  createdAt: Date,
  answer: string,
  format: QuestionFormatType,
  options: Array<string>,
  categoryUid: string,
  triviaSessionUid: string
};
