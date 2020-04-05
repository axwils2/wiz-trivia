// @flow
export const LANDING = "/";
export const SIGN_UP = "/signup";
export const SIGN_IN = "/signin";
export const HOME = "/home";
export const ACCOUNT = "/account";
export const TRIVIA_SESSIONS = "/sessions";
export const PASSWORD_FORGET = "/pw-forget";
export const TRIVIA_SESSION = {
  routePath: "/sessions/:triviaSessionUid",
  linkPath: (uid: string) => `/sessions/${uid}`
};
export const CATEGORY = {
  routePath: "/sessions/:triviaSessionUid/categories/:categoryUid",
  linkPath: (triviaSessionUid: string, uid: string) =>
    `/sessions/${triviaSessionUid}/categories/${uid}`
};
