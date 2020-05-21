// @flow
import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { withAuthentication, AuthUserContext } from "components/Session";
import { TriviaSessionProvider } from "components/TriviaSessionContext";
import { TeamProvider } from "components/TeamContext";
import AppBar from "components/AppBar";
import { NotificationProvider } from "components/Notification";
import LandingPage from "pages/LandingPage";
import TriviaSessionsPage from "pages/TriviaSessionsPage";
import TriviaSessionPage from "pages/TriviaSessionPage";
import ActiveTriviaSessionPage from "pages/ActiveTriviaSessionPage";
import CategoryPage from "pages/CategoryPage";
import QuestionPage from "pages/QuestionPage";
import SignInPage from "pages/SignInPage";
import SignUpPage from "pages/SignUpPage";
import PasswordForgetPage from "pages/PasswordForgetPage";

import * as ROUTES from "constants/routes";

const AuthorizedRoutes = ({ authUser }) => {
  if (!authUser) return null;

  return (
    <NotificationProvider>
      <Switch>
        <Route
          exact
          path={ROUTES.TRIVIA_SESSIONS}
          component={TriviaSessionsPage}
        />
        <Route
          exact
          path={ROUTES.TRIVIA_SESSION.routePath}
          component={TriviaSessionPage}
        />
        <Route
          exact
          path={ROUTES.CATEGORY.routePath}
          component={CategoryPage}
        />
        <Route
          exact
          path={ROUTES.QUESTION.routePath}
          component={QuestionPage}
        />
        <Route
          exact
          path={ROUTES.ACTIVE_TRIVIA_SESSION.routePath}
          component={ActiveTriviaSessionPage}
        />
        <Route path={ROUTES.LANDING} component={TriviaSessionsPage} />
      </Switch>
    </NotificationProvider>
  );
};

const UnauthrorizedRoutes = ({ authUser }) => {
  if (authUser) return null;

  return (
    <NotificationProvider>
      <Switch>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route
          exact
          path={ROUTES.ACTIVE_TRIVIA_SESSION.routePath}
          component={ActiveTriviaSessionPage}
        />
        <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route
          exact
          path={ROUTES.PASSWORD_FORGET}
          component={PasswordForgetPage}
        />
        <Route path={ROUTES.LANDING} component={SignInPage} />
      </Switch>
    </NotificationProvider>
  );
};

const App = () => {
  const authUser = useContext(AuthUserContext);

  return (
    <TriviaSessionProvider>
      <TeamProvider>
        <Router>
          <AppBar />
          <div style={{ padding: "16px 0 48px" }}>
            <AuthorizedRoutes authUser={authUser} />
            <UnauthrorizedRoutes authUser={authUser} />
          </div>
        </Router>
      </TeamProvider>
    </TriviaSessionProvider>
  );
};

export default withAuthentication(App);
