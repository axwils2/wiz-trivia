// @flow
export type TriviaSessionType = {
  uid: string,
  accessCode: ?string,
  currentCategoryId: ?string,
  currentQuestionId: ?string,
  name: ?string,
  active: boolean,
  userId: string
};
