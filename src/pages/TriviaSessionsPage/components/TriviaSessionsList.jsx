// @flow
import React, { useState, useEffect } from "react";

import { firestore } from "components/Firebase";
import { mapQuerySnapshot } from "functions/firestoreHelpers";

const TriviaSessionsList = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(
    () => {
      firestore
        .triviaSessions()
        .get()
        .then(querySnapshot => {
          const data = mapQuerySnapshot(querySnapshot);
          setSessions(sessions);
        });
    },
    [sessions]
  );

  if (sessions.length === 0) {
    return <div>No sessions to display. Create some!</div>;
  }

  return (
    <div>
      {sessions.map(session => <div key={session.uid}>{session.name}</div>)}
    </div>
  );
};

export default TriviaSessionsList;
