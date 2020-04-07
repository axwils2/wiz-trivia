// @flow
import React from "react";

import type { TeamAnswerType } from "types/TeamTypes";

type Props = {
  answer: TeamAnswerType,
  updateAnswer: (update: $Shape<TeamAnswerType>) => void
};

const AnswerSection = (props: Props) => {
  return <div>Answer Section</div>;
};

export default AnswerSection;
