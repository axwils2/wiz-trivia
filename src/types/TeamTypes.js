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

export type TeamCategoryWagerAmountType = {
  categoryUid: string,
  wagerAmountsRemaining: Array<number>
};

export type TeamType = {
  uid: string,
  answers: Array<TeamAnswerType>,
  categoryWagerAmounts: Array<TeamCategoryWagerAmountType>,
  name: string,
  pointsTotal: number
};
