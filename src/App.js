import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { withAuthentication } from "components/Session";

import LandingPage from "pages/Landing";
import SignUpPage from "pages/SignUp";
import SignInPage from "pages/SignIn";
import PasswordForgetPage from "pages/PasswordForget";
import AdminPage from "pages/Admin";

import * as ROUTES from "constants/routes";

const App = () => (
  <Router>
    <div>
      <hr />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
    </div>
  </Router>
);
export default withAuthentication(App);
