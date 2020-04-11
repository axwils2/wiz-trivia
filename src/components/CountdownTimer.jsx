// @flow
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import max from "lodash/max";

type Props = {
  count: number,
  onCountdownComplete?: () => void,
  size?: "small" | "medium" | "large"
};

const sizes = {
  small: {
    fontSize: "10px",
    progressSize: 20
  },
  medium: {
    fontSize: "16px",
    progressSize: 40
  },
  large: {
    fontSize: "22px",
    progressSize: 60
  }
};

const useStyles = makeStyles({
  timerContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  timerCount: {
    position: "absolute",
    fontSize: props => sizes[props.size].fontSize
  }
});

const CountdownTimer = ({
  count,
  onCountdownComplete,
  size = "medium"
}: Props) => {
  const classes = useStyles({ size: size });
  const [seconds, setSeconds] = useState(count);

  useEffect(
    () => {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => max([0, prevSeconds - 1]));
      }, 1000);

      return () => clearInterval(interval);
    },
    [count]
  );

  useEffect(
    () => {
      if (seconds > 0 || !onCountdownComplete) return;

      onCountdownComplete();
    },
    [seconds, onCountdownComplete]
  );

  const normalizedValue = () => {
    return seconds * 100 / count;
  };

  return (
    <Box className={classes.timerContainer}>
      <span className={classes.timerCount}>{seconds}</span>
      <CircularProgress
        variant={"static"}
        value={normalizedValue()}
        color="secondary"
        size={sizes[size].progressSize}
      />
    </Box>
  );
};

export default CountdownTimer;
