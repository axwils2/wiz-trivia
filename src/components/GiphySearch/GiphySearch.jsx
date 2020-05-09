// @flow
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { Carousel } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import debounce from "lodash/debounce";

const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);

const GiphySearch = () => {
  const [search, setSearch] = useState("test");

  // const fetchGifs = (offset: number) => {
  //   console.log(offset);
  //   console.log(search);

  //   return gf.search({
  //     term: search,
  //     options: {
  //       offset,
  //       limit: 10,
  //       rating: 'pg-13'
  //     }
  //   });
  // };

  // const debouncedFetchGifs = debounce(fetchGifs, 300);

  return (
    <Box>
      <TextField
        id={"giphySearch"}
        label={"Giphy Search"}
        variant="outlined"
        margin={"normal"}
        onChange={e => setSearch(e.target.value)}
        value={search}
        fullWidth
      />
      {/* <Carousel gifHeight={200} gutter={6} fetchGifs={fetchGifs} /> */}
    </Box>
  );
};

export default GiphySearch;
