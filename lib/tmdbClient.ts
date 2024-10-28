// tmdbClient.ts
import { TMDB } from 'tmdb-ts';


// Create Client
const client = new TMDB(process.env.TMDB_KEY);

// Wrapper for search to elastic search
const searchMovie = async (query: string, year: number) => {
    try {
      const response = await client.search.movies({ query, year });
      
      return response.results[0];
    } catch(err) {
      console.log(err);
      
      return "Error";
    }
}

const searchMovies = async (queries: any[]) => {
    const promises = queries.map(({title, release}) => searchMovie(title, release));

    return await Promise.all(promises);
}

const getMovieDetails = async (id: number) => {
    try {
        const details = await client.movies.details(id);
        const videos = await client.movies.videos(id);
        const cast = await client.movies.credits(id);
        const releaseDates = await client.movies.releaseDates(id);

        return {details, videos, cast, releaseDates}
    } catch(err) {
        console.log(err);

        return "Error";
    }
}

// Export the functions
module.exports = {
    searchMovie,
    searchMovies,
    getMovieDetails
};
