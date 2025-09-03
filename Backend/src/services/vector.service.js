// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const cohortchatgpt = pc.Index('cohortchatgpt');

async function creatememoryVector({vectors, metadata, messageId}) {
    await cohortchatgpt.upsert([ {
        id: messageId,
        values: vectors,
        metadata
    }])
}

async function queryMemory({queryvector, limit = 5 , metadata}) {
    const data = await cohortchatgpt.query({
        vector: queryvector,
        topK: limit,
        filter: metadata ? { metadata} : undefined,
        includeMetadata : true
    })

    return data.matches
}

module.exports = {
    creatememoryVector,
    queryMemory
}