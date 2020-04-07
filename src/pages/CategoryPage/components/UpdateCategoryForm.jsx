// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import { firestore } from "components/Firebase";
import type { CategoryType } from "types/CategoryTypes";

const UpdateCategoryForm = ({
  category,
  triviaSessionUid
}: {
  category: CategoryType,
  triviaSessionUid: string
}) => {
  const [name, setName] = useState(category.name);
  const [wagerType, setWagerType] = useState(category.wagerType);
  const invalid = name === "" || !wagerType;

  const updateCategory = () => {
    firestore
      .category(triviaSessionUid, category.uid)
      .update({ name, wagerType });
  };

  return (
    <Box marginBottom={"48px"}>
      <Typography variant={"h4"}>Category Details</Typography>
      <TextField
        id={"name"}
        label="Name"
        variant="outlined"
        onChange={e => setName(e.target.value)}
        margin={"normal"}
        value={name}
        fullWidth
      />
      <Box>
        <FormControl component="fieldset">
          <FormLabel component="legend">Wager Type</FormLabel>
          <RadioGroup
            aria-label="wager type"
            name="wagerType"
            value={wagerType}
            onChange={e => setWagerType(e.target.value)}
          >
            <FormControlLabel
              value="oneThroughSix"
              control={<Radio />}
              label="1-6"
            />
            <FormControlLabel
              value="upToTwentyFive"
              control={<Radio />}
              label="Up To 25"
            />
            <FormControlLabel
              value="adminChoice"
              control={<Radio />}
              label="Admin Choice"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Button
        disabled={invalid}
        variant={"contained"}
        color={"primary"}
        onClick={updateCategory}
        size={"large"}
        style={{ float: "right" }}
      >
        Update
      </Button>
    </Box>
  );
};

export default UpdateCategoryForm;
