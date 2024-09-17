from imdb import IMDb
import json
import random
import time

class IMDB_Movie_Fetcher():
    def __init__(self):
        self.ia = IMDb()

    # Searches for a movie in the IMDB database by name and year (optional)
    def search_movie(self, movie_name: str, year: int = None):
        output = self.ia.search_movie(movie_name)
    
        if not output:
            return None
    
        for movie in output:
            self.ia.update(movie)
            movie_year = movie.get('year')
            if year is None or movie_year == year:
                return movie
    
        return None  
    
# Test the fetcher to see if it finds somethhing for random movies from our dataset
def test3():
    fetcher = IMDB_Movie_Fetcher()
    with open('wiki_movie_plots_deduped.json') as file:
        json_movies = json.load(file)
    
    # Select a random movie from the list
    random_movie = random.choice(json_movies)
    title = random_movie.get('Title')
    year = random_movie.get('Release Year')
    year = int(year)
    
    
    start_time = time.time()
    movie = fetcher.search_movie(title, year)
    end_time = time.time()
    print(f"Time taken: {end_time - start_time:.2f} seconds")

    if movie:
        title = movie.get('title')
        year = movie.get('year')
        plot = movie.get('plot outline', 'Plot not available')
        poster_url = movie.get('full-size cover url') or movie.get('cover url', 'Poster not available')
        director = movie.get('director')

        print(f"Title: {title}")
        print(f"Year: {year}")
        print(f"Plot: {plot}")
        print(f"Director: {director}")
        print(f"Poster URL: {poster_url}")
    else:
        print("Movie not found.")

def test4():
    fetcher = IMDB_Movie_Fetcher()
    with open('wiki_movie_plots_deduped.json') as file:
        json_movies = json.load(file)
    
    movie_name = "Parasite"
    year = "2019"
    year = int(year)

    start_time = time.time()
    movie = fetcher.search_movie(movie_name, year)
    end_time = time.time()
    print(f"Time taken: {end_time - start_time:.2f} seconds")
    # show the info and poster
    if movie:
        title = movie.get('title')
        year = movie.get('year')
        plot = movie.get('plot outline', 'Plot not available')
        poster_url = movie.get('full-size cover url') or movie.get('cover url', 'Poster not available')
        director = movie.get('director')

        print(f"Title: {title}")
        print(f"Year: {year}")
        print(f"Plot: {plot}")
        print(f"Director: {director}")
        print(f"Poster URL: {poster_url}")
        print(f"Rating: {movie.get('rating')}")
        # download the poster
        import requests
        response = requests.get(poster_url)
        with open(f'{title}.jpg', 'wb') as file:
            file.write(response.content)

    else:
        print("Movie not found.")


test4()
