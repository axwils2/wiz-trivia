// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import { Carousel } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import debounce from "lodash/debounce";

const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);

const useStyles = makeStyles({
  searchContainer: {
    display: "flex"
  },
  searchButton: {
    margin: "16px 0 8px 8px"
  }
});

const GiphySearch = ({ onGifSelect }: { onGifSelect: (*) => void }) => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const fetchGifs = (offset: number) => {
    return gf.search(search, {
      offset,
      limit: 10,
      rating: "pg-13"
    });
  };

  const newSearch = () => {
    hideCarousel();
    showCarousel();
  };

  const hideCarousel = () => {
    setVisible(false);
  };

  const showCarousel = debounce(() => {
    console.log("got here");
    return setVisible(true);
  }, 100);

  const onGifClick = (gif: *, e) => {
    e.preventDefault();
    console.log(gif);
    onGifSelect(gif);
  };

  const renderCarousel = () => {
    if (visible) {
      return (
        <Carousel
          gifHeight={200}
          gutter={6}
          fetchGifs={fetchGifs}
          onGifClick={onGifClick}
        />
      );
    }

    return <Box style={{ height: "206px", width: "100%" }} />;
  };

  return (
    <Box>
      <Box className={classes.searchContainer}>
        <TextField
          id={"giphySearch"}
          placeholder={"Search GIFs..."}
          variant="outlined"
          margin={"normal"}
          onChange={e => setSearch(e.target.value)}
          value={search}
          fullWidth
        />
        <Button
          variant={"contained"}
          onClick={newSearch}
          color={"primary"}
          size={"large"}
          className={classes.searchButton}
        >
          <SearchIcon />
        </Button>
      </Box>
      {renderCarousel()}
    </Box>
  );
};

export default GiphySearch;
