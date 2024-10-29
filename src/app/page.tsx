"use client"; // Use the client-side runtime

import { useState } from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [movieResults, setMovieResults] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); //Default to false because we haven't searched yet
  const [movieDetails, setMovieDetails] = useState<{ rating: number; reviewCount: number } | null>(null);


  const handleSubmit = async () => {
    if (userInput.trim() === '') {
      alert("Please describe the movie you're looking for.");
      return;
    }

    console.log(process.env.NEXT_PUBLIC_BONSAI_URL, process.env.NEXT_PUBLIC_BONSAI_U, process.env.NEXT_PUBLIC_BONSAI_P);

    try {
      // Send a POST request to the /api/search endpoint with the user's input
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();

      console.log('Response from search:', data);

      if (response.ok) {
        // Update the movieResults state with the returned movie titles
        console.log('Movie Results:', data.movies);
        setMovieResults(data.movies);
        setMovieDetails(data.movieDetails);
        setErrorMessage(null);  
        setHasSearched(true);  // Indicate that a search has been made
      } else {
        // Handle any errors from the API
        setErrorMessage(data.error || 'An error occurred while searching for movies.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setErrorMessage('Failed to search for movies.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 main-bg">
      
      {!hasSearched ? (
        // Larger marquee-styled search box before the first search
        <div className="flex flex-col items-center justify-center w-full max-w-xl p-8">
          <h2 className="text-4xl font-bold mb-8 text-center">Search Movie</h2>

          <div className="marquee-border w-full p-6 mb-8">
            <div className="marquee-lights">
              <span className="light"></span>
              <span className="light"></span>
              <span className="light"></span>
              <span className="light"></span>
            </div>

            <textarea
              className="w-full p-6 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ea18c] text-black"
              placeholder="Describe the movie you want to find..."
              rows={6}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {  // Avoids newline if shift key is not pressed
                  e.preventDefault(); // Prevents adding a new line
                  handleSubmit(); // Calls your handleSubmit function
                }
              }}
            />
          </div>

          <button
            className="submit-button w-full text-white py-3 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c786d] focus:ring-opacity-50"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      ) : (
        // Full layout after search
        <div className="grid-layout w-full max-w-7xl">
        
          {/* Search Section */}
          <div className="search-section">
            <h2 className="text-2xl font-bold mb-4">Search Movie</h2>
            
            <div className="marquee-border mb-4">
              <div className="marquee-lights">
                <span className="light"></span>
                <span className="light"></span>
                <span className="light"></span>
                <span className="light"></span>
              </div>
              <textarea
                className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ea18c] text-black"
                placeholder="Describe the movie you want to find..."
                rows={4}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {  // Avoids newline if shift key is not pressed
                    e.preventDefault(); // Prevents adding a new line
                    handleSubmit(); // Calls your handleSubmit function
                  }
                }}
              />
            </div>

            <button
              className="submit-button w-full text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c786d] focus:ring-opacity-50"
              onClick={handleSubmit}
            >
              Submit
            </button>

            {/* Top Guesses */}
            {movieResults.length > 1 && (
              <>
                <h3 className="text-xl mt-6">Other Top Guesses:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {movieResults.slice(1, 4).map((movie, index) => (
                    <li key={index}>{movie}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Poster Section - Visible After Search */}
          <div className="poster-section">
            <h2 className="text-2xl font-bold mb-4">Top Result</h2>
            <div className="border border-gray-500 flex items-center justify-center">
              {movieResults.length > 0 ? (
                <img
                  src={`/poster.jpg?${new Date().getTime()}`}  // Internet said this would force refresh dont really know why
                  alt={movieResults[0]}  // First movie title
                  className="w-[300px] h-[450px] object-cover rounded-md"  // Fixed width and height
                />
              ) : (
                <p>3:2 Ratio Poster Placeholder</p>
              )}
            </div>
            <div className="mt-4">
              <p>{movieResults.length > 0 ? `Title: ${movieResults[0]}` : "Title"}</p>
              {movieDetails && (
                <>
                  <p>Average Rating: {movieDetails.rating} / 10</p>
                  <p>Number of Ratings: {movieDetails.reviewCount}</p>
                </>
              )}
            </div>
          </div>


          {/* Recommendations Section - Visible After Search */}
          <div className="recommendations-section">
            <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
            <p className="italic">Coming Soon...</p>
          </div>

        </div>
      )}
    </main>
  );
}