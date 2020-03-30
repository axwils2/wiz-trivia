// @flow
import FirebaseContext from "./context";
import withFirebase from "./withFirebase";
import * as auth from "./auth";
import * as firestore from "./firestore";

const firebase = { auth, firestore };

export default firebase;
export { FirebaseContext, withFirebase, auth, firestore };
