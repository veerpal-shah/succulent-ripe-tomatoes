"use client"; // Use the client-side runtime

import * as React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Theaters';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Home
const Home = () => {
  const [hasText, setHasText] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [movieResults, setMovieResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <Container sx={{padding: "0 40px"}} maxWidth="lg">
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
              <div className="mt-4">
                <ul className="list-disc pl-5">
                {movieResults.map((movie, index) => (
                  <li key={index}><h2>{movie.title}</h2><img src={"https://image.tmdb.org/t/p/w154" + movie.poster_path} /></li>
                ))}
                </ul>
              </div>
              </motion.div>
            )}
        </AnimatePresence>
      </Container>
  );
};

export default Home;