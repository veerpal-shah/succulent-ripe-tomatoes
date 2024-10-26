// tmdbClient.ts
import { TMDB } from 'tmdb-ts';


// Create Client
const client = new TMDB("eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NTFhMDhjOWMyNTYwMmZhMzAyNzVjZDgzNzA3M2VkZiIsIm5iZiI6MTcyOTgyOTU4NS4wNzYwNTgsInN1YiI6IjY3MWIxYTIyNWQwZGU4OTA0MmQ5MDA0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A2QjbEEo473SLZffmXFcziaGEZlo6XFLGGlzTYeVMkc");

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
    return {
        foo: "bar"
    }
}

// Export the functions
module.exports = {
    searchMovie,
    searchMovies,
    getMovieDetails
};
