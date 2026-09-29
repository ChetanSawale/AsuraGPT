const { Pinecone } = require('@pinecone-database/pinecone');

let pc = null;
let cohortchatgpt = null;

try {
    if (process.env.PINECONE_API_KEY) {
        pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        cohortchatgpt = pc.Index('cohortchatgpt');
    } else {
        console.warn("⚠️ PINECONE_API_KEY not found in env. Vector memory features disabled.");
    }
} catch (err) {
    console.warn("⚠️ Failed to initialize Pinecone client:", err.message);
}

async function creatememoryVector({ vectors, metadata, messageId }) {
    if (!cohortchatgpt || !vectors) return;
    try {
        // Pinecone metadata values must be primitive types (strings/numbers/booleans)
        const cleanMetadata = {};
        if (metadata) {
            Object.keys(metadata).forEach(key => {
                if (metadata[key] !== undefined && metadata[key] !== null) {
                    cleanMetadata[key] = metadata[key].toString();
                }
            });
        }
        await cohortchatgpt.upsert([{
            id: messageId,
            values: vectors,
            metadata: cleanMetadata
        }]);
    } catch (error) {
        console.warn("⚠️ Vector upsert failed:", error.message);
    }
}

async function queryMemory({ queryvector, limit = 5, metadata }) {
    if (!cohortchatgpt || !queryvector) return [];
    try {
        const queryOptions = {
            vector: queryvector,
            topK: limit,
            includeMetadata: true
        };
        if (metadata && Object.keys(metadata).length > 0) {
            const filterObj = {};
            Object.keys(metadata).forEach(k => {
                if (metadata[k]) filterObj[k] = metadata[k].toString();
            });
            if (Object.keys(filterObj).length > 0) {
                queryOptions.filter = filterObj;
            }
        }
        const data = await cohortchatgpt.query(queryOptions);
        return data?.matches || [];
    } catch (error) {
        console.warn("⚠️ Vector query failed:", error.message);
        return [];
    }
}

module.exports = {
    creatememoryVector,
    queryMemory
};