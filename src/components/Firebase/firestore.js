// @flow
import { firestore, timestamp as firebaseTimestamp } from "./firebase";

export const users = () => firestore.collection("users");
export const user = (uid: string) => users().doc(uid);

export const triviaSessions = () => firestore.collection("triviaSessions");
export const triviaSession = (uid: string) => triviaSessions().doc(uid);

export const categories = (triviaSessionUid: string) =>
  triviaSession(triviaSessionUid).collection("categories");
export const category = (triviaSessionUid: string, uid: string) =>
  categories(triviaSessionUid).doc(uid);

export const teams = (triviaSessionUid: string) =>
  triviaSession(triviaSessionUid).collection("teams");
export const team = (triviaSessionUid: string, uid: string) =>
  teams(triviaSessionUid).doc(uid);

export const pastSessionResults = (triviaSessionUid: string) =>
  triviaSession(triviaSessionUid).collection("pastResults");
export const pastSessionResult = (triviaSessionUid: string, uid: string) =>
  pastSessionResults(triviaSessionUid).doc(uid);

export const questions = (triviaSessionUid: string, categoryUid: string) =>
  category(triviaSessionUid, categoryUid).collection("questions");
export const question = (
  triviaSessionUid: string,
  categoryUid: string,
  uid: string
) => questions(triviaSessionUid, categoryUid).doc(uid);

export const triviaSessionQuestions = (triviaSessionUid: string) =>
  firestore
    .collectionGroup("questions")
    .where("triviaSessionUid", "==", triviaSessionUid);

export const timestamp = firebaseTimestamp;
