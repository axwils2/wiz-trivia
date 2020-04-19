// @flow
import type { QuestionWagerFormatType } from "types/QuestionTypes";

export type TeamAnswerStatusType =
  | "draft"
  | "pending"
  | "refreshed"
  | "incorrect"
  | "correct";

export type TeamAnswerType = {
  body: ?string,
  categoryUid: string,
  questionUid: string,
  status: TeamAnswerStatusType,
  wagerAmount: ?number,
  wagerAwardedAmount: ?number,
  wagerFormat: QuestionWagerFormatType
};

export type TeamType = {
  uid: string,
  answers: Array<TeamAnswerType>,
  name: string,
  pointsTotal: number
};
