// @flow
export type TriviaSessionStatusType = "active" | "disabled" | "complete";

export type TriviaSessionType = {
  uid: string,
  accessCode: ?string,
  currentCategoryId: ?string,
  currentQuestionId: ?string,
  name: ?string,
  status: TriviaSessionStatusType,
  userId: string
};
