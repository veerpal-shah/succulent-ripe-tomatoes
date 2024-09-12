import requests
import webbrowser

api_key = "6fe130c49e280de9fe8b3996b83e009e" 
search_url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=the+avengers"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZmUxMzBjNDllMjgwZGU5ZmU4YjM5OTZiODNlMDA5ZSIsIm5iZiI6MTcyNjE3MDgxNi44MjE0Miwic3ViIjoiNjZlMzQ2MjEwMDAwMDAwMDAwYjk1NjdhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.5gUvmxaU2aXbvvvPOanExW1eAtcTdpCoesXI1MNmHLs"
}

response = requests.get(search_url, headers=headers)

search_results = response.json()

poster_path = search_results['results'][0]['poster_path']



if search_results['results']:
    movie_id = search_results['results'][0]['id'] 
    print(f"Movie ID for 'The Avengers': {movie_id}")

    movie_details_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}"
    movie_details_response = requests.get(movie_details_url, headers=headers)
    movie_details = movie_details_response.json()

    vote_count = movie_details.get('vote_count', 'N/A')
    vote_average = movie_details.get('vote_average', 'N/A')
    poster_path = movie_details.get('poster_path', '')
    full_path = "https://image.tmdb.org/t/p/w500/" + poster_path
    webbrowser.open(full_path)



    print(f"Number of ratings: {vote_count}")
    print(f"Average rating: {vote_average}/10")
    poster_path = ['poster_path']
    reviews_url = f"https://api.themoviedb.org/3/movie/{movie_id}/reviews?api_key={api_key}&language=en-US&page=1"
    reviews_response = requests.get(reviews_url, headers=headers)
    reviews_data = reviews_response.json()

    if reviews_data['results']:
        for review in reviews_data['results']:
            print(f"Author: {review['author']}")
            print(f"Review: {review['content']}\n")
    else:
        print("No reviews found for this movie.")
else:
    print("Movie not found.")


img_data = requests.get(full_path).content
with open('image_name.jpg', 'wb') as handler:
    handler.write(img_data)