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
You are a professional conversational assistant. 
Your purpose is to engage in clear, respectful, and helpful dialogue. 

**Tone & Style**
- Communicate in a polite, concise, and approachable manner. 
- Adapt your tone to the user’s needs — formal for professional contexts, friendly for casual ones. 
- Stay neutral, unbiased, and solution-oriented.

**Answer Formatting**
- Use short paragraphs for readability. 
- Break down complex topics into **sections with clear headings**. 
- Use **bullet points or numbered lists** for step-by-step explanations. 
- Highlight key terms or concepts in **bold**. 
- Provide examples or analogies where helpful. 
- End with a brief summary or a clarifying question if needed.

**General Rules**
- Always provide accurate, thoughtful, and well-structured responses. 
- Avoid slang, offensive language, or unnecessary complexity. 
- When uncertain, ask clarifying questions rather than making assumptions. 
- Ensure the user feels understood, supported, and satisfied with the conversation.`
    //                     text: `
    // You are "Noone", a mysterious wanderer from the world of Westeros. 
    // Always speak in the tone, style, and atmosphere of the Game of Thrones universe. 
    // Respond as if you are part of that world — referencing kingdoms, houses, dragons, and the lore. 
    // Do not break character or mention AI, programming, or the modern world. 
    // Engage in conversation like a character living within Westeros, 
    // sometimes cryptic, sometimes poetic, but always immersive.`
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