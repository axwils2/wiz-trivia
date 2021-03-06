// @flow
import type { CategoryType } from "types/CategoryTypes";
import type { QuestionType } from "types/QuestionTypes";

export type TriviaSessionStatusType = "active" | "disabled" | "complete";
export type LeaderBoardType = Array<LeaderBoardElementType>;
export type LeaderBoardElementType = { name: string, pointsTotal: number };

export type TriviaSessionType = {
  uid: string,
  accessCode: string,
  currentCategory: ?CategoryType,
  currentQuestion: ?QuestionType,
  name: ?string,
  status: TriviaSessionStatusType,
  userUid: string,
  waitingMessage: ?string,
  leaderBoardVisible: boolean,
  leaderBoard: LeaderBoardType,
  archived: boolean
};
