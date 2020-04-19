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
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import orderBy from "lodash/orderBy";
import max from "lodash/max";
import find from "lodash/find";
import findIndex from "lodash/findIndex";

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
  },
  orderCell: {
    width: "104px"
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

  const updateCategoryOrders = (oldOrder: number, newOrder: number) => {
    const categoryMoved = find(
      categories,
      category => category.order === oldOrder
    );
    const movedIndex = findIndex(
      categories,
      category => category.uid === categoryMoved.uid
    );
    const categoryReplaced = find(
      categories,
      category => category.order === newOrder
    );
    const replacedIndex = findIndex(
      categories,
      category => category.uid === categoryReplaced.uid
    );

    updateCategory(categoryMoved.uid, { order: newOrder }).then(() => {
      updateCategory(categoryReplaced.uid, { order: oldOrder }).then(() => {
        const newCategories = Array.from(categories);
        newCategories[movedIndex] = {
          ...newCategories[movedIndex],
          order: newOrder
        };
        newCategories[replacedIndex] = {
          ...newCategories[replacedIndex],
          order: oldOrder
        };

        setCategories(newCategories);
      });
    });
  };

  const updateCategory = (uid: string, updates: *) => {
    return firestore.category(triviaSession.uid, uid).update(updates);
  };

  const maxOrder = () => {
    return max(categories.map(category => category.order)) || 0;
  };

  return (
    <>
      <div className={classes.header}>
        <Typography variant={"h4"}>Session Categories</Typography>
        <NewCategoryModal newOrderValue={maxOrder() + 1} />
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.orderCell}>Order</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Repeat Wagers Disabled</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBy(categories, ["order"], ["asc"]).map(category => (
              <TableRow key={category.uid}>
                <TableCell className={classes.orderCell}>
                  {category.order}
                  {category.order !== 1 && (
                    <IconButton
                      color={"inherit"}
                      aria-label={"moveUp"}
                      size={"small"}
                      onClick={() =>
                        updateCategoryOrders(category.order, category.order - 1)
                      }
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                  )}
                  {category.order !== maxOrder() && (
                    <IconButton
                      color={"inherit"}
                      aria-label={"moveDown"}
                      size={"small"}
                      onClick={() =>
                        updateCategoryOrders(category.order, category.order + 1)
                      }
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell>
                  {category.repeatWagersDisabled ? "True" : "False"}
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
