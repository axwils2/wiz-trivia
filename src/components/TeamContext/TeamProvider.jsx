// @flow
import * as React from "react";
import { useState } from "react";

import type { TeamType } from "types/TeamTypes";
import TeamContext from "./TeamContext";

const TeamProvider = ({ children }: { children: React.Node }) => {
  const [team, setTeam] = useState(null);

  const updateTeam = (updates: TeamType) => {
    const safeTeam = team || {};

    return setTeam({ ...safeTeam, ...updates });
  };

  const contextValue = {
    team,
    updateTeam
  };

  return (
    <TeamContext.Provider value={contextValue}>{children}</TeamContext.Provider>
  );
};

export default TeamProvider;
