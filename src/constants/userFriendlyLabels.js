// @flow
export const categoryWagerLabels = [
  {
    label: "Wager amount is a sliding scale from 0 to 25",
    value: "upToTwentyFive"
  },
  {
    label: "Wager amounts are 1-6 (No repeated wagers)",
    value: "oneThroughSix"
  },
  {
    label: "Wager amounts are blank time of answer",
    value: "adminChoice"
  }
];

export const incorrectAnswerPenaltyLabels = [
  {
    label: "No change in total points",
    value: "zeroPoints"
  },
  {
    label: "Points wagered will be subtracted from total points",
    value: "negativePoints"
  }
];

export const questionFormatLabels = [
  {
    label: "Open Response",
    value: "openResponse"
  },
  {
    label: "Multiple Choice",
    value: "multipleChoice"
  },
  {
    label: "Place In Order",
    value: "placeInOrder"
  }
];
