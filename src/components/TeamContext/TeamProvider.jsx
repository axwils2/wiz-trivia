// @flow
import * as React from "react";
import { useState } from "react";

import TeamContext from "./TeamContext";

const TeamProvider = ({ children }: { children: React.Node }) => {
  const contextValue = {};
  <TeamContext.Provider value={contextValue}>{children}</TeamContext.Provider>;
};

export default TeamProvider;
