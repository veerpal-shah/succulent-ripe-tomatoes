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

    # POSTER
    poster_path = response['results'][0]['poster_path']
    full_path = "https://image.tmdb.org/t/p/w500/" + poster_path
    img_data = requests.get(full_path).content
    with open('poster.jpg', 'wb') as handler:
        handler.write(img_data)
        print("Poster Downloaded")
    
    # RATING INFO
    print(f"Number of Ratings:  {response['results'][0]['vote_count']}")
    print(f"Average Rating Out of 10:  {response['results'][0]['vote_average']}")
    movie_id = response['results'][0]['id']

    # 3 REVIEWS
    review_url = f"https://api.themoviedb.org/3/movie/{movie_id}/reviews?api_key={api_key}"
    reviews = requests.get(review_url, headers=headers).json()
    print(reviews['results'][0]['content'])

