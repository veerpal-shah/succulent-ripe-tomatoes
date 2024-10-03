"use client"; // Use the client-side runtime

import { useState } from 'react'; // Import useState hook

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [movieResults, setMovieResults] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setMovieResults(data.movies);
        setErrorMessage(null);  // Clear any previous errors
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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#d6b392]">
      <div className="w-full max-w-3xl p-8 bg-[#c09a7a] border-2 border-[#dbab7f] rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Hollywood Movies and More</h1>
        <p className="text-center text-lg mb-8">
          What movie am I thinking of? Does it exist? Let’s NOT find out!
        </p>
        
        {/* Centered Input Box */}
        <textarea
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ea18c] text-black"
          placeholder="Describe the movie you want to find..."
          rows={6}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        {/* Submit Button */}
        <button
          className="mt-4 w-full bg-[#8ea18c] text-white py-2 px-4 rounded-lg hover:bg-[#7a8a7b] focus:outline-none focus:ring-2 focus:ring-[#6c786d] focus:ring-opacity-50"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {/* Display search results or error */}
        <div className="mt-4">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {movieResults.length > 0 && (
            <ul className="list-disc pl-5">
              {movieResults.map((movie, index) => (
                <li key={index}>{movie}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
