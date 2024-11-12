// pages/api/movieDetails.ts
import type { NextApiRequest, NextApiResponse } from 'next';
const tmdbClient = require('../../lib/tmdbClient');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { movieId } = req.query;

    if (!movieId) {
      return res.status(400).json({ error: 'Movie id is required.' });
    }
    
    try {
      const movie = await tmdbClient.getMovieDetails(movieId);

      return res.status(200).json({ movie });
    } catch (error) {
      console.error('Error searching documents:', error);
      
      return res.status(500).json({ error: 'Error searching for movie.' });
    }
  } else {
    // Only allow GET requests
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
