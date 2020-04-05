// @flow
import React from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import * as ROUTES from "constants/routes";

const SignUpLink = () => (
  <p>
    Dont have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpLink;
