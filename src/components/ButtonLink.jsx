// @flow
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const ButtonLink = (props: *) => {
  return <Button component={Link} {...props} />;
};

export default ButtonLink;
