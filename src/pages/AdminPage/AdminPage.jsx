// @flow
import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { compose } from "recompose";
import { withAuthorization, withEmailVerification } from "components/Session";
import * as ROUTES from "constants/routes";

const AdminPage = () => (
  <div>
    <h1>Admin</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>
  </div>
);

const condition = authUser => !!authUser;
export default compose(withEmailVerification, withAuthorization(condition))(
  AdminPage
);
