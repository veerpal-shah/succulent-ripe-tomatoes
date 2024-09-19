export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#d6b392]">
      <div className="w-full max-w-3xl p-8 bg-[#c09a7a] border-2 border-[#dbab7f] rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Hollywood Movies and More</h1>
        <p className="text-center text-lg mb-8">
          What movie am I thinking of? Does it exist? Let’s NOT find out!
        </p>
        
        {/* Centered Input Box */}
        <textarea
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ea18c]"
          placeholder="Describe the movie you want to find..."
          rows={6}
        ></textarea>

        {/* Submit Button */}
        <button
          className="mt-4 w-full bg-[#8ea18c] text-white py-2 px-4 rounded-lg hover:bg-[#7a8a7b] focus:outline-none focus:ring-2 focus:ring-[#6c786d] focus:ring-opacity-50"
        >
          Submit
        </button>
      </div>
    </main>
  );
}
                                                      
