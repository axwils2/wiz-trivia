// @flow
import * as React from "react";
import { useState } from "react";

import type { TriviaSessionType } from "types/TriviaSessionTypes";
import TriviaSessionContext from "./TriviaSessionContext";

const TriviaSessionProvider = ({ children }: { children: React.Node }) => {
  const [triviaSession, setTriviaSession] = useState(null);

  const updateTriviaSession = (updates: $Shape<TriviaSessionType>) => {
    const safeTriviaSession = triviaSession || {};

    return setTriviaSession({ ...safeTriviaSession, ...updates });
  };

  const contextValue = {
    triviaSession,
    updateTriviaSession
  };

  return (
    <TriviaSessionContext.Provider value={contextValue}>
      {children}
    </TriviaSessionContext.Provider>
  );
};

export default TriviaSessionProvider;
