// @flow
export const LANDING = "/";
export const SIGN_UP = "/signup";
export const SIGN_IN = "/signin";
export const HOME = "/home";
export const ACCOUNT = "/account";
export const TRIVIA_SESSIONS = "/sessions";
export const PASSWORD_FORGET = "/pw-forget";

export const ACTIVE_TRIVIA_SESSION = {
  routePath: "/trivia/:triviaSessionUid",
  linkPath: (uid: string) => `/trivia/${uid}`
};

export const TRIVIA_SESSION = {
  routePath: "/sessions/:triviaSessionUid",
  linkPath: (uid: string) => `/sessions/${uid}`
};

export const CATEGORY = {
  routePath: "/sessions/:triviaSessionUid/categories/:categoryUid",
  linkPath: (triviaSessionUid: string, uid: string) =>
    `/sessions/${triviaSessionUid}/categories/${uid}`
};

export const QUESTION = {
  routePath:
    "/sessions/:triviaSessionUid/categories/:categoryUid/questions/:questionUid",
  linkPath: (triviaSessionUid: string, categoryUid: string, uid: string) =>
    `/sessions/${triviaSessionUid}/categories/${categoryUid}/questions/${uid}`
};
