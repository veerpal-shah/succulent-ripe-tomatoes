"use client"; // Use the client-side runtime

import * as React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import MovieDetails from '../components/MovieDetails';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Theaters';
import ArrowBack from '@mui/icons-material/ArrowBackIosNew';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import StopIcon from '@mui/icons-material/Stop';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// Home
const Home = () => {
  const [hasText, setHasText] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [movieResults, setMovieResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentMovie, setCurrentMovie] = useState<any | null>(null);
  const [currentMovieDetails, setCurrentMovieDetails] = useState<any | null>(null);


  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const handleRecord = async () => {
    // Request permission to access the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
  
    recorder.start();
    setIsRecording(true);
  
    // Capture audio data as chunks
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
  
    // Save the recording as a Blob and start transcription when recording stops
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      setAudioBlob(blob); // Dont need this
      setIsRecording(false);
  
      // Start transcription after recording stops
      await handleTranscription(blob);
    };
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    if (!blob) return;
  
    setLoading(true); // Show loading spinner
    console.log('Transcribing audio...');
  
    const formData = new FormData();
    formData.append("audio", blob, "recorded.wav");
  
    // Send the audio file to the backend for transcription
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });
  
    const { transcript, error } = await response.json();
    setLoading(false); // Hide loading spinner
  
    if (transcript) {
      console.log('Transcription:', transcript);
      setUserInput(transcript); // Aiden Test This
      setHasText(true);
    } else {
      console.error('Error transcribing audio:', error);
    }
  };

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
        setMovieResults(data.movies.filter((movie: any) => movie));
        setCurrentMovie(data.movies[0]);
        setErrorMessage(null);  // Clear any previous errors
        // fetchMovieDetails();
      } else {
        // Handle any errors from the API
        setErrorMessage(data.error || 'An error occurred while searching for movies.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setErrorMessage('Failed to search for movies.');
    }
  }

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Send a POST request to the /api/search endpoint with the user's input
        const response = await fetch('/api/movieDetails?movieId=' + currentMovie.id, {
          method: 'GET'
        });
  
        const data = await response.json();
  
        console.log('Response from details:', data);
  
        if (response.ok) {
          // Update the movieResults state with the returned movie titles
          setCurrentMovieDetails(data.movie);
          // setErrorMessage(null);  // Clear any previous errors
        } else {
          // Handle any errors from the API
          setErrorMessage(data.error || 'An error occurred while searching for the movie.');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        // setErrorMessage('Failed to search for movies.');
      }
    }

    fetchMovieDetails();
  }, [currentMovie?.id]);

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
              value={userInput}
              sx={{
                "& label": {
                  color: '#ffffff',
                  fontSize: '24px',
                  "&.Mui-focused": {
                    color: '#ffffff'
                  }
                },
                "& textarea": {
                  color: '#a0a0a0',
                  marginTop: '20px',
                  fontSize: '18px',
                  letterSpacing: '0.5px',
                  lineHeight: '140%',
                  paddingBottom: '4px'
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
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={isRecording ? handleStopRecording : handleRecord} style={{ fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer' }}>
                {isRecording ? <StopIcon style={{ fontSize: '48px', color: 'red' }} /> : <RadioButtonUncheckedIcon style={{ fontSize: '48px', color: 'green' }} />}
              </button>
              
              {loading && (
                <div style={{ marginTop: '10px' }}>
                  <CircularProgress size={24} />
                </div>
              )}
            </div>
            <Button onClick={handleClick} disabled={!hasText} aria-label="search" startIcon={<SearchIcon />} className="iconColor" 
              sx={{
                color: '#FFC107',
                marginTop: '10px',
                "&.Mui-disabled": {
                  color: "#5f4803"
                },
                '&:hover': {
                  backgroundColor: 'rgba(97, 105, 141, 0.2)'
                },
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
                  <Grid className="resultsHero" size={12} sx={{ backgroundImage: "url('https://image.tmdb.org/t/p/original" + currentMovie.backdrop_path + "')"}}>
                    <Button onClick={handleBack} className="backBtn" variant="text" sx={{
                      "span": {
                        paddingLeft: '10px'
                      },
                      color: '#FFFFFF',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      marginLeft: '6.5vw',
                      fontSize: '0.75rem',
                      marginTop: '0.5vw'
                    }}>
                      <ArrowBack/>
                        <span>Back</span>
                    </Button>
                    <Box className="rating" sx={{position: "absolute", bottom: '1vw', left: '7.5vw', "svg": { color: '#FFC107'}}}>
                      <CircularProgress size={50} variant="determinate" value={Math.floor(currentMovie.vote_average * 10)} />
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
                        >{currentMovie.vote_average.toFixed(1)}</Typography>
                      </Box>
                      <Box className="votes" sx={{
                        "h6": { 
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        },
                        "p": {
                          fontWeight: 'bold',
                          fontSize: '.7rem',
                          color: '#eeeeee',
                        }
                      }}>
                        <h6 className="votesTotal">{currentMovie.vote_count > 1000 ? `${(currentMovie.vote_count / 1000).toFixed(1)}K VOTES` : `${currentMovie.vote_count} VOTES`}</h6>
                        <p className="votesTag">Users Are Recommending It</p>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={8.8}>
                        <MovieDetails movie={currentMovieDetails}/>
                  </Grid>
                  <Grid className='moreLikeThis' size={3.2} sx={{
                    "h2": {
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '1.05rem'
                    },
                    "ul": {
                      listStyleType: 'none',
                  
                      "li": {
                        marginTop: '25px',
                        display: 'flex',
                        position: 'relative',
                  
                        "img": {
                          width: '27%',
                          borderRadius: '5%',
                          filter: 'drop-shadow(black 2px 2px 2px)'
                        }
                      }
                    }
                  }}>
                    <h2>More like this</h2>
                    <ul>
                    {movieResults.map((movie, index) => (
                      movie.id !== currentMovie.id && (
                      <li key={index} onClick={() => setCurrentMovie(movie) }>
                        <img src={"https://image.tmdb.org/t/p/w154" + movie.poster_path} />
                        <Box className="moreRatingContainer" sx={{
                            "h3": {
                              fontWeight: '600',
                              fontSize: '0.8rem',
                              color: '#FFFFFF',
                              paddingLeft: '3%',
                              display: '-webkit-box',
                              webkitBoxOrient: 'vertical',
                              webkitLineClamp: '2',
                              lineClamp: '2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            },
                        }}>
                          <h3>{movie.title}</h3>
                          <Box className="moreRating" sx={{
                            "svg": {
                              color: '#FFC107',
                            },
                          
                            "div": {
                              fontSize: '0.7vw',
                              position: 'absolute',
                            }
                          }}>
                            <CircularProgress size={'2vw'} variant="determinate" value={Math.floor(movie.vote_average * 10)} />
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

                                "span": {
                                  paddingTop: '1.8vw',
                                  marginLeft: '5.4vw',
                                  color: '#727ba4',
                                }
                              }}
                            >
                              <Typography
                                variant="caption"
                                component="div"
                                sx={{ color: '#ffffff', fontWeight: 'bold' }}
                              >{movie.vote_average.toFixed(1)}</Typography>
                              <span>({(new Date(movie.release_date)).getFullYear()})</span>
                            </Box>
                          </Box>
                        </Box>
                      </li>
                      )
                    ))}
                    </ul>
                  </Grid>
                </Grid>
              </Box>
              </motion.div>
            )}
        </AnimatePresence>
      </Container>
  );
};

export default Home;