import path from 'path';
// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
const { Client } = require('elasticsearch');
const fs = require('fs');

// Simulate your searchData function here
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'Movie description is required.' });
    }

    console.log("Environment variables in API handler:", {
      url: process.env.NEXT_PUBLIC_BONSAI_URL,
      username: process.env.NEXT_PUBLIC_BONSAI_U,
      password: process.env.NEXT_PUBLIC_BONSAI_P,
    });

    // Create Client
    const client = new Client({
      host: process.env.BONSAI_URL,
      auth: {
        username: process.env.BONSAI_ACCESS,
        password: process.env.BONSAI_SECRET,
      },
    });

    console.log("Client created:", client);

    try {
      const response = await client.search({
        index: 'movies',
        body: {
          query: {
            more_like_this: {
              fields: ['Plot'],
              like: userInput,
              min_term_freq: 1,
              max_query_terms: 25,
              min_doc_freq: 1
            }
          }
        }
      });

      console.log("Response from search:", response);

      // Get the titles of the matching movies
      const movieTitles = response?.hits?.hits?.map((hit: any) => hit?._source?.Title);
      // const movieTitles = ['The Matrix', 'The Matrix Reloaded', 'The Matrix Revolutions'];

      // Get movie info for the first movie
      const moveiDetails = await getMovieInfo(movieTitles[0]);
      
      // Send a response back to the client with the movie titles
      return res.status(200).json({ movies: movieTitles, response: response, moveiDetails: moveiDetails });
    } catch (error) {
      console.error('Error searching documents:', error);
      return res.status(500).json({ error: 'Error searching for movies.' });
    }
  } else {
    // Only allow POST requests
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}


async function getMovieInfo(movie: string): Promise<any> {
  const api_key = process.env.TMDB_API_KEY;
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(movie)}`;


  try {
      const response = await fetch(searchUrl);
      const data = await response.json();

      console.log("Movie Info:", data);

      if (data.results && data.results.length > 0) {
          // POSTER
          const posterPath: string = data.results[0].poster_path;
          const fullPath: string = `https://image.tmdb.org/t/p/w500/${posterPath}`;
          const imgResponse = await fetch(fullPath);
          const imgData = await imgResponse.arrayBuffer();
          const buffer = Buffer.from(imgData);

          //fs.writeFileSync('poster.jpg', buffer);
          const posterFilePath = path.join(process.cwd(), 'public', 'poster.jpg');
          fs.writeFileSync(posterFilePath, buffer);
          console.log("Poster Downloaded");

          console.log(`Number of Ratings: ${data.results[0].vote_count}`);
          console.log(`Average Rating Out of 10: ${data.results[0].vote_average}`);
          const movieId: number = data.results[0].id;

          const reviewUrl = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${api_key}`;
          const reviewsResponse = await fetch(reviewUrl);
          const reviewsData = await reviewsResponse.json();

          if (reviewsData.results && reviewsData.results.length > 0) {
              console.log(reviewsData.results[0].content);
          } else {
              console.log("No reviews found.");
          }

          return data;
      } else {
          console.log("No results found.");
      }
  } catch (error) {
      console.error("Error fetching movie info:", error);
  }
}