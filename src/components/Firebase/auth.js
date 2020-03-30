// @flow
import { auth } from "./firebase";
import { user } from "./firestore";

export const doCreateUserWithEmailAndPassword = (
  email: string,
  password: string
) => auth.createUserWithEmailAndPassword(email, password);

export const doSignInWithEmailAndPassword = (email: string, password: string) =>
  auth.signInWithEmailAndPassword(email, password);

export const doSignOut = () => auth.signOut();
export const doPasswordReset = (email: string) =>
  auth.sendPasswordResetEmail(email);
export const doPasswordUpdate = (password: string) =>
  auth.currentUser.updatePassword(password);

export const doSendEmailVerification = () =>
  auth.currentUser.sendEmailVerification({
    url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
  });

export const onAuthUserListener = (next: *, fallback: *) =>
  auth.onAuthStateChanged(authUser => {
    if (authUser) {
      user(authUser.uid)
        .get()
        .then(user => {
          const dbUser = user.data();
          // merge auth and db user
          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            providerData: authUser.providerData,
            ...dbUser
          };
          next(authUser);
        });
    } else {
      fallback();
    }
  });
