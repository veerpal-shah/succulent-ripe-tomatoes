// bonsaiClient.ts
const { Client } = require('elasticsearch');

// Create Client
const client = new Client({
    host: process.env.NEXT_PUBLIC_BONSAI_URL,
    auth: {
        username: process.env.BONSAI_ACCESS_KEY,
        password: process.env.BONSAI_SECRET_KEY
    }
});

// Wrapper for search to elastic search
const search = async (query: String) => {
    try {
        const response = await client.search({
            index: 'movies',
            body: {
                query: {
                    more_like_this: {
                        fields: ['Plot'],
                        like: query,
                        min_term_freq: 1,
                        max_query_terms: 25,
                        min_doc_freq: 1
                    }
                }
            }
        });

        return parseSearchResponse(response)
    } catch (error) {
        console.error('Error searching documents:', error);
        return
    }
}

// Parse elastic search into list of movie objects
const parseSearchResponse = (response: any) => {
    return response?.hits?.hits?.map((hit: any) => {
        return {
            "id": hit?._id,
            "cast": hit?._source?.Cast.split(', '),
            "director": hit?._source?.Director,
            "genre": hit?._source?.Genre,
            "origin": hit?._source['Origin/Ethnicity'],
            "plot": hit?._source?.Plot,
            "release": parseInt(hit?._source['Release Year']),
            "title": hit?._source?.Title,
            "wiki": hit?._source['Wiki Page']
        }
    });
}

// Export the functions
module.exports = {
    search
};
