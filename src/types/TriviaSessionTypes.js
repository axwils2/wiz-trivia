// @flow
export type TriviaSessionStatusType = "active" | "accepting" | "closed";
export type TriviaSessionType = {
  uid: string,
  accessCode: ?string,
  currentCategoryId: ?string,
  currentQuestionId: ?string,
  name: ?string,
  status: TriviaSessionStatusType,
  userId: string
};
