import React from "react";
import { compose } from "recompose";

import { PasswordForgetForm } from "pages/PasswordForgetPage";
import PasswordChangeForm from "components/PasswordChangeForm";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "components/Session";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);
const condition = authUser => !!authUser;
export default compose(withEmailVerification, withAuthorization(condition))(
  AccountPage
);
