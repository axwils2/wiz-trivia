// @flow
import * as firebase from "firebase";
import { firestore } from "./firebase";

export const users = () => firestore.collection("users");
export const user = (uid: string) => users().doc(uid);

export const timestamp = () => firebase.firestore.Timestamp.now();
