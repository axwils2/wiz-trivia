// @flow
import * as React from "react";
import { useState } from "react";

import TriviaSessionContext from "./TriviaSessionContext";

const TriviaSessionProvider = ({ children }: { children: React.Node }) => {
  const contextValue = {};
  <TriviaSessionContext.Provider value={contextValue}>
    {children}
  </TriviaSessionContext.Provider>;
};

export default TriviaSessionProvider;
