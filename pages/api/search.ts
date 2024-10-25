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

    // Create Client
    const client = new Client({
      host: process.env.NEXT_PUBLIC_BONSAI_URL,
      auth: {
        username: process.env.BONSAI_ACCESS_KEY,
        password: process.env.BONSAI_SECRET_KEY,
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

      // Get the data of the matching movies
      const movies = response?.hits?.hits?.map((hit: any) => {
        return {
          "id": hit?._id,
          "cast": hit?._source?.Cast.split(', '),
          "director": hit?._source?.Director,
          "genre": hit?._source?.Genre,
          "origin": hit?._source['Origin/Ethnicity'],
          "plot": hit?._source?.Plot,
          "release": hit?._source['Release Year'],
          "title": hit?._source?.Title,
          "wiki": hit?._source['Wiki Page']
        }
      });
      // Send a response back to the client with the movie data
      return res.status(200).json({ movies });
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
