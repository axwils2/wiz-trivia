// @flow
import * as React from "react";
import { useContext } from "react";
import FirebaseContext from "./context";

// $FlowFixMe
const withFirebase = (Component: React.AbstractComponent) => (props: *) => {
  const firebase = useContext(FirebaseContext);

  return <Component {...props} firebase={firebase} />;
};

export default withFirebase;
