// @flow
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";

const AdminActiveSession = ({ match }: { match: * }) => {
  const [triviaSession, setTriviaSession] = useState(null);
  const triviaSessionUid = match.params.triviaSessionUid;

  useEffect(
    () => {
      if (!triviaSessionUid) return;

      firestore
        .triviaSession(triviaSessionUid)
        .get()
        .then(doc => {
          const data = docDataWithId(doc);
          setTriviaSession(data);
        });
    },
    [triviaSessionUid]
  );

  if (!triviaSession) return null;
  if (triviaSession.status !== "active") {
    return (
      <Typography>This trivia session is {triviaSession.status}!</Typography>
    );
  }

  return <div>admin view</div>;
};

export default withRouter(AdminActiveSession);
