// @flow
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import sortedUniq from "lodash/sortedUniq";
import max from "lodash/max";

import { firestore } from "components/Firebase";
import { mapQuerySnapshot } from "functions/firestoreHelpers";
import ButtonLink from "components/ButtonLink";
import * as ROUTES from "constants/routes";
import NewCategoryModal from "./NewCategoryModal";
import type { TriviaSessionType } from "types/TriviaSessionTypes";

const useStyles = makeStyles(theme => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingBottom: theme.spacing(2)
  }
}));

const CategoriesTable = ({
  triviaSession
}: {
  triviaSession: TriviaSessionType
}) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);

  useEffect(
    () => {
      firestore
        .categories(triviaSession.uid)
        .orderBy("order", "asc")
        .get()
        .then(querySnapshot => {
          const data = mapQuerySnapshot(querySnapshot);
          setCategories(data);
        });
    },
    [triviaSession.uid]
  );

  const newOrderValue = () => {
    const maxOrder = max(categories.map(category => category.order)) || 0;
    return maxOrder + 1;
  };

  return (
    <>
      <div className={classes.header}>
        <Typography variant={"h4"}>Session Categories</Typography>
        <NewCategoryModal newOrderValue={newOrderValue()} />
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Wager Amounts</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.uid}>
                <TableCell component="th" scope="row">
                  {category.order}
                </TableCell>
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell align="right">
                  {sortedUniq(category.wagerAmounts).join(", ")}
                </TableCell>
                <TableCell align="right">
                  <ButtonLink
                    to={ROUTES.CATEGORY.linkPath(
                      triviaSession.uid,
                      category.uid
                    )}
                    variant={"contained"}
                    size={"small"}
                    color={"primary"}
                  >
                    Edit
                  </ButtonLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CategoriesTable;
