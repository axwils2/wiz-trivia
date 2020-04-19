// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

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
  const [repeatWagersDisabled, setRepeatWagersDisabled] = useState(
    category.repeatWagersDisabled
  );
  const invalid = name === "";

  const updateCategory = () => {
    firestore
      .category(triviaSessionUid, category.uid)
      .update({ name, repeatWagersDisabled });
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
        <FormControlLabel
          control={
            <Checkbox
              checked={repeatWagersDisabled}
              onChange={() => setRepeatWagersDisabled(prev => !prev)}
              name="repeatWagersDisabled"
              color="primary"
              value={repeatWagersDisabled}
            />
          }
          label="Disable Repeat Wagers Within This Category (Multiple Choice Wager Format Only)"
        />
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
