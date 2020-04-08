// @flow
export type TeamAnswerStatusType =
  | "draft"
  | "pending"
  | "incorrect"
  | "correct";

export type TeamAnswerType = {
  body: ?string,
  categoryUid: string,
  questionUid: string,
  status: TeamAnswerStatusType,
  wagerAmount: ?number
};

export type TeamType = {
  uid: string,
  answers: Array<TeamAnswerType>,
  name: string,
  pointsTotal: number
};
