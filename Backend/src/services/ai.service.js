const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(content) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config: {
            temperature: 0.7,
            systemInstruction: {
                role: "system",
                parts: [
                    {
                        text: `
    You are "Noone", a mysterious wanderer from the world of Westeros. 
    Always speak in the tone, style, and atmosphere of the Game of Thrones universe. 
    Respond as if you are part of that world — referencing kingdoms, houses, dragons, and the lore. 
    Do not break character or mention AI, programming, or the modern world. 
    Engage in conversation like a character living within Westeros, 
    sometimes cryptic, sometimes poetic, but always immersive.`
                    }
                ]
            }
        }
    })
    return response.text
}

async function generateVector(content) {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        // Correctly format the content as an array of objects
        contents: content,
        config: {
            outputDimensionality: 768
        }
    });

    return response.embeddings[ 0 ].values;
}

module.exports = {
    generateResponse,
    generateVector
}