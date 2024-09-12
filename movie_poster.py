import requests

api_key = "6fe130c49e280de9fe8b3996b83e009e" 
search_url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=the+avengers"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZmUxMzBjNDllMjgwZGU5ZmU4YjM5OTZiODNlMDA5ZSIsIm5iZiI6MTcyNjE3MDgxNi44MjE0Miwic3ViIjoiNjZlMzQ2MjEwMDAwMDAwMDAwYjk1NjdhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.5gUvmxaU2aXbvvvPOanExW1eAtcTdpCoesXI1MNmHLs"
}

response = requests.get(search_url, headers=headers)
search_results = response.json()

if search_results['results']:
    poster_path = search_results['results'][0]['poster_path']
    full_path = "https://image.tmdb.org/t/p/w500/" + poster_path
    img_data = requests.get(full_path).content
    with open('image_name.jpg', 'wb') as handler:
        handler.write(img_data)
