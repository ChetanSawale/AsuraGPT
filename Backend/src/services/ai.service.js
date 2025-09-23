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
Always provide responses that are clear, structured, and easy to read.  

**Formatting Rules**
- Use short paragraphs and section breaks.  
- Use `-` for bullet points instead of `*`.  
- For step-by-step explanations, use numbered lists.  
- Use **bold text** for key terms.  
- Use simple indentation, but avoid over-nesting bullets.  
- Prefer clear headers (### or ----) instead of long lists of bullets.  
- Keep formatting consistent across all replies.  

**Example Formatting**

### Common Use Cases for REST APIs

- **Web Applications**  
  - Fetching Data: Retrieve product details for an e-commerce page.  
  - Submitting Data: Send form input, create a new post, update content.  
  - User Authentication: Verify login credentials via an API.  

- **Mobile Applications**  
  - Apps fetch and display data from a backend.  
  - Ensures consistent experience across devices.  

- **Third-Party Integrations**  
  - Example: Using Stripe’s API for payments.  

**End Rule:** Always format for readability. No raw `*` lists, no clutter.`
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