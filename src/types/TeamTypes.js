// @flow
export type TeamAnswerStatusType = "pending" | "incorrect" | "correct";

export type TeamAnswerType = {
  body: ?string,
  catgoryId: string,
  questionId: string,
  status: TeamAnswerStatusType,
  wagerAmount: number
};

export type TeamCategoryWagerAmountType = {
  categoryId: string,
  wagerAmountsRemaining: Array<number>
};

export type TeamType = {
  uid: string,
  answers: Array<TeamAnswerType>,
  categoryWagerAmounts: Array<TeamCategoryWagerAmountType>,
  name: string,
  pointsTotal: number
};
