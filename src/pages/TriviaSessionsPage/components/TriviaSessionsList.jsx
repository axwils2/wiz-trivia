// @flow
import React, { useState, useEffect, useContext } from "react";

import { firestore } from "components/Firebase";
import { AuthUserContext } from "components/Session";
import { mapQuerySnapshot } from "functions/firestoreHelpers";

const TriviaSessionsList = () => {
  const authUser = useContext(AuthUserContext);
  const [sessions, setSessions] = useState([]);

  useEffect(
    () => {
      firestore
        .triviaSessions()
        .where("userId", "==", authUser.uid)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get()
        .then(querySnapshot => {
          const data = mapQuerySnapshot(querySnapshot);
          setSessions(data);
        });
    },
    [authUser.uid]
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
