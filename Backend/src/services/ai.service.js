const { GoogleGenAI } = require("@google/genai");

// Initialize GoogleGenAI client with key from env
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const MODEL_CANDIDATES = [
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b"
].filter(Boolean);

async function generateResponse(content) {
    let lastError = null;

    // Gemini requires conversations to end with a user turn.
    // Ensure the last message in the array is always from 'user'.
    let messages = Array.isArray(content) ? [...content] : [{ role: 'user', parts: [{ text: String(content) }] }];
    if (messages.length > 0 && messages[messages.length - 1].role !== 'user') {
        // Remove trailing model turns to satisfy the API constraint
        while (messages.length > 0 && messages[messages.length - 1].role !== 'user') {
            messages.pop();
        }
    }
    if (messages.length === 0) {
        return "I'm ready to help! What would you like to know?";
    }

    for (const modelName of MODEL_CANDIDATES) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: messages,
                config: {
                    temperature: 0.7,
                    systemInstruction: {
                        role: "system",
                        parts: [
                            {
                                text: `
You are AsuraGPT, a professional and intelligent conversational assistant. 
Your purpose is to engage in clear, respectful, and helpful dialogue. 

**Tone & Style**
- Communicate in a polite, concise, and approachable manner. 
- Adapt your tone to the user's needs — formal for professional contexts, friendly for casual ones. 
- Stay neutral, unbiased, and solution-oriented.

**Answer Formatting**
- Use short paragraphs for readability. 
- Break down complex topics into sections with clear headings. 
- Use bullet points or numbered lists for step-by-step explanations. 
- Highlight key terms or concepts in bold. 
- End with a brief summary or a clarifying question if needed.`
                            }
                        ]
                    }
                }
            });
            const text = response?.text;
            if (text && text.trim().length > 0) {
                return text;
            }
            console.warn(`⚠️ Model ${modelName} returned empty response, trying next...`);
        } catch (error) {
            console.warn(`⚠️ Model ${modelName} attempt failed:`, error.message);
            lastError = error;
        }
    }
    console.error("Error in generateResponse across all candidates:", lastError?.message);
    // Return a graceful fallback instead of crashing the socket handler
    return "I'm sorry, I'm having trouble generating a response right now. Please try again in a moment.";
}

async function generateVector(content) {
    try {
        if (!content || typeof content !== 'string') return null;
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: content,
            config: {
                outputDimensionality: 768
            }
        });

        if (response && response.embeddings && response.embeddings[0]) {
            return response.embeddings[0].values;
        }
        return null;
    } catch (error) {
        console.warn("⚠️ Warning: Vector embedding failed:", error.message);
        return null;
    }
}

async function generateSummary(messages) {
    const textContent = messages.map(m => `${m.role}: ${m.content}`).join("\n");
    for (const modelName of MODEL_CANDIDATES) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: `Please summarize the following conversation concisely in 2-3 key bullet points:\n\n${textContent}`
            });
            if (response && response.text) {
                return response.text;
            }
        } catch (error) {
            console.warn(`⚠️ Summary model ${modelName} failed:`, error.message);
        }
    }
    return "Could not generate summary at this time.";
}

module.exports = {
    generateResponse,
    generateVector,
    generateSummary
};