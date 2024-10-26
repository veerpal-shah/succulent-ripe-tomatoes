"use client"; // Use the client-side runtime

import * as React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Theaters';
import ArrowBack from '@mui/icons-material/ArrowBackIosNew';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';

// Home
const Home = () => {
  const [hasText, setHasText] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [movieResults, setMovieResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBack = () => {
    setMovieResults([]);
  }

  const handleChange = (event:any) => {
    setHasText(event.target.value.trim().length > 0);
    setUserInput(event.target.value);
  };

  const handleClick = async () => {
    setLoading(true);

    try {
      // Send a POST request to the /api/search endpoint with the user's input
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      setLoading(false);

      console.log('Response from search:', data);

      if (response.ok) {
        // Update the movieResults state with the returned movie titles
        setMovieResults(data.movies);
        setErrorMessage(null);  // Clear any previous errors
      } else {
        // Handle any errors from the API
        setErrorMessage(data.error || 'An error occurred while searching for movies.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setErrorMessage('Failed to search for movies.');
    }
  }

  return (
    <Container sx={{padding: "0 40px"}} maxWidth="xl">
      <AnimatePresence>
        {movieResults.length == 0 && (
          <motion.div
            key="container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.35, ease: "easeOut" }}
            exit={{ opacity: 0, y: -40, transition: { delay: 0.5, duration: 0.2 } }}
          >
          <Box sx={{ maxWidth: '630px',  margin: "25vh auto 0", textAlign: "right" }}>
            <TextField
              id="standard-textarea"
              label="What movie am I thinking of? Does it exist? Let's find out!"
              placeholder="Describe the movie you want to find..."
              multiline
              variant="standard"
              className="input-search"
              fullWidth
              sx={{
                "& label": {
                  "&.Mui-focused": {
                    color: '#ffffff',
                  }
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#252b3b',
                },
              }}
              onChange={handleChange}
            />
            {loading && (<CircularProgress
              size={24}
              sx={{
                color: '#252b3b',
                position: 'relative',
                marginBottom: '-14px',
                marginRight: '10px',
              }}
            />)}
            <Button onClick={handleClick} disabled={!hasText} aria-label="search" startIcon={<SearchIcon />} className="iconColor" 
              sx={{
              "&.Mui-disabled": {
                color: "#5f4803"
              },
              '&:hover': {
                backgroundColor: 'rgba(97, 105, 141, 0.2)'
              } 
              }}>
                <span style={{transition: "opacity 0.4s ease", textTransform: "none", color:"white", opacity: hasText ? 1 : 0.5}}>Search</span>
            </Button>
          </Box>
          </motion.div>
          )}
          {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
            {movieResults.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8, ease: "easeOut" }}
                exit={{ opacity: 0, y: -40, transition: { delay: 0, duration: 0.2 } }}
              >
              <Box sx={{flexGrow: 1 }}>
                <Grid container>
                  <Grid className="resultsHero" size={12} sx={{ backgroundImage: "url('https://image.tmdb.org/t/p/original" + movieResults[0].backdrop_path + "')"}}>
                    <Button onClick={handleBack} className="backBtn" variant="text">
                      <ArrowBack/>
                        <span>Back</span>
                    </Button>
                    <Box className="rating" sx={{position: "absolute", bottom: '1vw', left: '7.5vw'}}>
                      <CircularProgress size={50} variant="determinate" value={Math.floor(movieResults[0].vote_average * 10)} />
                      <Box
                        sx={{
                          top: -3,
                          left: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          width: '100%',
                        }}
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{ fontSize: '16px', color: '#ffffff', fontWeight: 'bold' }}
                        >{movieResults[0].vote_average.toFixed(1)}</Typography>
                      </Box>
                      <Box className="votes">
                        <h6>{movieResults[0].vote_count > 1000 ? `${(movieResults[0].vote_count / 1000).toFixed(1)}K VOTES` : `${movieResults[0].vote_count} VOTES`}</h6>
                        <p>Users Are Recommending It</p>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={8.8} sx={{ background: "none"}}>
                  <h2>size=8.8</h2>
                  </Grid>
                  <Grid className='moreLikeThis' size={3.2} sx={{ background: "none"}}>
                    <h2>More like this</h2>
                    <ul className="list-disc pl-5">
                    {movieResults.map((movie, index) => (
                      index !== 0 && (
                      <li key={index}><h3>{movie.title}</h3><img src={"https://image.tmdb.org/t/p/w154" + movie.poster_path} /></li>
                      )
                    ))}
                    </ul>
                  </Grid>
                </Grid>
              </Box>
              {/* <div className="mt-4">
                <ul className="list-disc pl-5">
                {movieResults.map((movie, index) => (
                  <li key={index}><h2>{movie.title}</h2><img src={"https://image.tmdb.org/t/p/w154" + movie.poster_path} /></li>
                ))}
                </ul>
              </div> */}
              </motion.div>
            )}
        </AnimatePresence>
      </Container>
  );
};

export default Home;