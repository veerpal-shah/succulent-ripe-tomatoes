"use client"; // Use the client-side runtime

import { useState } from 'react'; // Import useState hook

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [movieResults, setMovieResults] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // New state for tracking search status

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
            />
          </div>

          <button
            className="submit-button w-full text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c786d] focus:ring-opacity-50"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {/* Top Guesses */}
          {hasSearched && movieResults.length > 1 && (
            <>
              <h3 className="text-xl mt-6">Other Top Guesses:</h3>
              <ul className="list-disc pl-5 mt-2">
                {movieResults.slice(1).map((movie, index) => (
                  <li key={index}>{movie}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Poster Section - Always Visible with Placeholder */}
        <div className="poster-section">
          <h2 className="text-2xl font-bold mb-4">Top Results</h2>
          <div className="aspect-w-2 aspect-h-3 border border-gray-500 flex items-center justify-center">
            {hasSearched && movieResults.length > 0 ? (
              <img
                src="/image_name.jpg"  // Couldn't get this to work
                alt={movieResults[0]}  // I think this is how this should be accessed but not sure because bonsai isn't working on my LM
                className="object-cover w-full h-full rounded-md"
              />
            ) : (
              <p>3:2 Ratio Poster Placeholder</p> // Placeholder text for the poster section
            )}
          </div>
          <div className="mt-4">
            <p>{hasSearched && movieResults.length > 0 ? `Title: ${movieResults[0]}` : "Title"}</p>
            <p>Rating</p>
            <p>Review</p>
          </div>
        </div>

        {/* Recommendations Section - Always Visible */}
        <div className="recommendations-section">
          <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
          <p className="italic">Coming Soon...</p>
        </div>
      </div>
    </main>
  );
}



/* 
- Need to get this tied to the elastic search to test functionality
- Need ability to pull image and reviews
- Need to add in the recommendations section
- Potentially add functionality so that only the search section is visible until a search is made
*/