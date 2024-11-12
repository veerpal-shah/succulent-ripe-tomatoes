// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
const bonsaiClient = require('../../lib/bonsaiClient');
const tmdbClient = require('../../lib/tmdbClient');

// Simulate your searchData function here
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'Movie description is required.' });
    }
    
    try {
      const searchResults = await bonsaiClient.search(userInput);
      console.log(searchResults);
      const movies = await tmdbClient.searchMovies(searchResults);

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
