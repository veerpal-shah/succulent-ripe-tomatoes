// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
const { Client } = require('elasticsearch');
const fs = require('fs');
require('dotenv').config();

// Simulate your searchData function here
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'Movie description is required.' });
    }

    // Create Client
    const client = new Client({
      host: process.env.NEXT_PUBLIC_BONSAI_URL,
      auth: {
        username: process.env.NEXT_PUBLIC_BONSAI_U,
        password: process.env.NEXT_PUBLIC_BONSAI_P,
      },
    });

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

      // Get the titles of the matching movies
      const movieTitles = response.hits.hits.map((hit: any) => hit._source.Title);
      // const movieTitles = ['The Matrix', 'The Matrix Reloaded', 'The Matrix Revolutions'];
      
      // Send a response back to the client with the movie titles
      return res.status(200).json({ movies: movieTitles });
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
