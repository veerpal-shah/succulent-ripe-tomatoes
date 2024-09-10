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
        const bulkBody = data.flatMap(doc => [
            { index: { _index: 'movies' } },  // Index operation
            doc
        ]);

        // Perform the bulk indexing
        const { body: bulkResponse } = await client.bulk({ refresh: true, body: bulkBody });

        if (bulkResponse.errors) {
            const erroredDocuments = bulkResponse.items.filter(item => item.index && item.index.error);
            console.error('Error:', erroredDocuments);
        } else {
            console.log('All documents have been indexed.');
        }
    } catch (error) {
        console.error('Error indexing documents:', error);
    }
}

async function searchData() {
    try {
        const response = await client.search({
            index: 'movies',
            body: {
                query: {
                    more_like_this: {
                        fields: ["Plot"],
                        like: "A fish lives with his dad and starts school. The fish sees a boat and goes to touch it. He gets grabbed and taken away. The father goes to find him.",
                        min_doc_freq: 1,
                        min_term_freq: 2,
                        max_query_terms: 25,
                        minimum_should_match: "50%",
                        stop_words: ["the", "and", "to", "with", "a"]
                    }
                }
            }
        });

        console.log('Search Results:', response.hits.hits.map(hit => hit._source.Title));
    } catch (error) {
        console.error('Error searching documents:', error);
    }
}


searchData();
