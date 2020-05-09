// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
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
  },
  gifImage: {
    height: "270px",
    marginTop: "16px",
    maxWidth: "100%"
  },
  selectedContainer: {
    position: "relative"
  },
  clearGifIcon: {
    position: "absolute",
    top: 16,
    left: 0
  }
});

const GiphySearch = ({
  onGifSelect,
  gifUrl,
  id
}: {
  onGifSelect: (*) => void,
  gifUrl: ?string,
  id: string
}) => {
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

  const clearGif = (e: *) => {
    e.preventDefault();
    onGifSelect(null);
  };

  const newSearch = () => {
    hideCarousel();
    showCarousel();
  };

  const hideCarousel = () => {
    setVisible(false);
  };

  const showCarousel = debounce(() => {
    return setVisible(true);
  }, 100);

  const onGifClick = (gif: *, e) => {
    e.preventDefault();
    onGifSelect(gif.images.downsized.url);
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

  const selected = () => (
    <Box className={classes.selectedContainer}>
      <img src={gifUrl} className={classes.gifImage} />
      <IconButton
        onClick={clearGif}
        className={classes.clearGifIcon}
        color={"secondary"}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );

  const renderSearch = () => (
    <>
      <Box className={classes.searchContainer}>
        <TextField
          id={id}
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
    </>
  );

  return <Box>{gifUrl ? selected() : renderSearch()}</Box>;
};

export default GiphySearch;
