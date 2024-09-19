const { Client } = require('elasticsearch');
const fs = require('fs');
require('dotenv').config({path: '../../.env.local'});

// Make a .env.local file in the root of the project and add the following:
const client = new Client({
  host: process.env.NEXT_PUBLIC_BONSAI_URL,
  auth: {
    username: process.env.BONSAI_ACCESS_KEY,
    password: process.env.BONSAI_SECRET_KEY,
  },
});

async function loadData() {
    try {
        // Read the JSON file
        const data = JSON.parse(fs.readFileSync('wiki_movie_plots_deduped.json', 'utf-8'));

        // Create a bulk request body
        const bulkBody = data.flatMap((doc: any) => [
            { index: { _index: 'movies' } },  // Index operation
            doc
        ]);

        // Perform the bulk indexing
        const { body: bulkResponse } = await client.bulk({ refresh: true, body: bulkBody });

        if (bulkResponse.errors) {
            const erroredDocuments = bulkResponse.items.filter((item: any) => item.index && item.index.error);
            console.error('Error:', erroredDocuments);
        } else {
            console.log('All documents have been indexed.');
        }
    } catch (error) {
        console.error('Error indexing documents:', error);
    }
}

// const userInput = "A clownfish gets lost from his home and has to find his way back. His dad goes to look for him with his friend. He encounters a shark, a turtle, and a whale along the way. The lost fish is stuck in a dentist office";
// const userInput = "A man is imprisoned for murdering his wife. He escapes from prison through a tunnel and meets his friend on the outside in Mexico.";
// const userInput = "Crops aren't growing well on earth. The space agency notices a worm hole near Saturn. A team of astronauts goes through the worm hole to find a new planet for humans to live on. They encounter a black hole and travel through time.";
const userInput = "A family discovers festival grounds in the woods. The parents gorge themselves on food and drink and turn into pigs. The daughter has to work in the bathhouse to save them. She meets a dragon and a witch along the way.";
async function searchData(input : string) {
    try {
        const response = await client.search({
            index: 'movies',
            body: {
                query: {
                    more_like_this: {
                        fields: ['Plot'], 
                        like: userInput,
                        min_term_freq: 1,
                        max_query_terms: 25,
                        min_doc_freq: 1
                    }
                }
            }
        });
        console.log('Search Results:', response.hits.hits.map((hit: any) => hit._source.Title));
        // console.log('Search Results:', JSON.stringify(response));
        // fs.writeFileSync('search_results.json', JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('Error searching documents:', error);
    }
}


searchData(userInput);
