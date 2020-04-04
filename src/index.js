import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import * as serviceWorker from "./serviceWorker";
import App from "./App";
import firebase, { FirebaseContext } from "components/Firebase";

ReactDOM.render(
  <FirebaseContext.Provider value={firebase}>
    <CssBaseline />
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
