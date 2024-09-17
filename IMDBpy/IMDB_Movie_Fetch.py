import time
import json
from imdb import IMDb

class IMDB_Movie_Fetcher():
    
    @staticmethod
    def search_movie(movie_name: str, year: int = None):
        ia = IMDb()
        output = ia.search_movie(movie_name)
    
        if not output:
            return None
    
        for movie in output:
            ia.update(movie)
            movie_year = movie.get('year')
            if year is None or movie_year == year:
                return movie
    
        return None 

    @staticmethod
    def get_movie_info(movie_name: str, year: int = None):
        movie = IMDB_Movie_Fetcher.search_movie(movie_name, year)
        if not movie:
            return json.dumps({"error": "Movie not found"})
        
        title = movie.get('title')
        year = movie.get('year')
        plot = movie.get('plot outline', 'Plot not available')
        poster_url = movie.get('full-size cover url') or movie.get('cover url', 'Poster not available')
        director = [person['name'] for person in movie.get('director', [])]
        cast = [person['name'] for person in movie.get('cast', [])]
        rating = movie.get('rating')
        reviews = movie.get('reviews', 'Reviews not available')

        movie_info = {
            "title": title,
            "year": year,
            "plot": plot,
            "poster_url": poster_url,
            "director": director,
            "cast": cast,
            "rating": rating,
            "reviews": reviews
        }

        return json.dumps(movie_info, indent=4)

# Example usage
def test_movie_info():
    movie_info_json = IMDB_Movie_Fetcher.get_movie_info("Parasite", 2019)
    print(movie_info_json)

test_movie_info()