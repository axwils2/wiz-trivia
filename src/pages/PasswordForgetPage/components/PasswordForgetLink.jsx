// @flow
import React from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import * as ROUTES from "constants/routes";

const PasswordForgetLink = () => (
  <Typography>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </Typography>
);

export default PasswordForgetLink;
