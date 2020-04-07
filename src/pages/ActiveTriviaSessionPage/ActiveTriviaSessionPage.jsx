// @flow
import React, { useContext } from "react";
import Container from "@material-ui/core/Container";

import { AdminActiveSession, PlayerActiveSession } from "./components";
import { AuthUserContext } from "components/Session";

const ActiveTriviaSessionPage = () => {
  const authUser = useContext(AuthUserContext);

  const renderContent = () => {
    if (authUser) return <AdminActiveSession />;
    return <PlayerActiveSession />;
  };

  return <Container maxWidth={"md"}>{renderContent()}</Container>;
};

export default ActiveTriviaSessionPage;
