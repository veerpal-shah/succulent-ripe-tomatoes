import requests

api_key = "6fe130c49e280de9fe8b3996b83e009e" 
headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZmUxMzBjNDllMjgwZGU5ZmU4YjM5OTZiODNlMDA5ZSIsIm5iZiI6MTcyNjE3MDgxNi44MjE0Miwic3ViIjoiNjZlMzQ2MjEwMDAwMDAwMDAwYjk1NjdhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.5gUvmxaU2aXbvvvPOanExW1eAtcTdpCoesXI1MNmHLs"
}

#replace this
movie = input("Enter movie:  ")

search_url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={movie.replace(' ', '+')}"
response = requests.get(search_url, headers=headers).json()

if response['results']:

    movie_id = response['results'][0]['id']

    # TRAILER
    trailer_url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={api_key}"
    response = requests.get(trailer_url, headers=headers).json()

    # results with type: Trailer AND official: true
    for result in response['results']:
        trailers = []
        if result['type'] == 'Trailer' and result['official']:
            trailers.append("https://www.youtube.com/watch?v=" + result['key'])
    print(trailers)