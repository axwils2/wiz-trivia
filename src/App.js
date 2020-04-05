// @flow
import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { withAuthentication, AuthUserContext } from "components/Session";
import { TriviaSessionProvider } from "components/TriviaSessionContext";
import { TeamProvider } from "components/TeamContext";
import AppBar from "components/AppBar";
import LandingPage from "pages/LandingPage";
import TriviaSessionsPage from "pages/TriviaSessionsPage";
import AccountPage from "pages/AccountPage";
import SignInPage from "pages/SignInPage";
import SignUpPage from "pages/SignUpPage";
import PasswordForgetPage from "pages/PasswordForgetPage";

import * as ROUTES from "constants/routes";

const AuthorizedRoutes = ({ authUser }) => {
  if (!authUser) return null;

  return (
    <Switch>
      <Route
        exact
        path={ROUTES.TRIVIA_SESSIONS}
        component={TriviaSessionsPage}
      />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.LANDING} component={TriviaSessionsPage} />
    </Switch>
  );
};

const UnauthrorizedRoutes = ({ authUser }) => {
  if (authUser) return null;

  return (
    <Switch>
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route
        exact
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route path={ROUTES.LANDING} component={SignInPage} />
    </Switch>
  );
};

const App = () => {
  const authUser = useContext(AuthUserContext);

  return (
    <TriviaSessionProvider>
      <TeamProvider>
        <Router>
          <AppBar />
          <AuthorizedRoutes authUser={authUser} />
          <UnauthrorizedRoutes authUser={authUser} />
        </Router>
      </TeamProvider>
    </TriviaSessionProvider>
  );
};

export default withAuthentication(App);
