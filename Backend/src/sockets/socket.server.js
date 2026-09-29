const { Server } = require("socket.io");
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model");
const aiService = require('../services/ai.service');
const messageModel = require("../models/message.model");
const { creatememoryVector, queryMemory } = require("../services/vector.service");

function initsocketserver(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                // allow local, configured client, or production origins
                callback(null, true);
            },
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
            const token = cookies.token || socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
            const user = await userModel.findById(decoded.id);
            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            console.error("Socket Auth Error:", err.message);
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("⚡ User connected:", socket.user?.email || socket.id);

        socket.on("ai-message", async (messagePayload) => {
            try {
                if (!messagePayload || !messagePayload.chat || !messagePayload.content) {
                    return;
                }

                socket.join(messagePayload.chat);

                // 1. Save user message & generate vector concurrently
                const [message, vectors] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: messagePayload.content,
                        role: "user"
                    }),
                    aiService.generateVector(messagePayload.content)
                ]);

                // 2. Save vector memory (if vector embedding succeeded)
                if (vectors) {
                    await creatememoryVector({
                        vectors,
                        messageId: message._id.toString(),  
                        metadata: {
                            chat: messagePayload.chat,
                            user: socket.user._id.toString(),
                            text: messagePayload.content
                        }
                    });
                }

                // 3. Query memory & retrieve recent chat history
                const [memoryMatches, chatHistory] = await Promise.all([
                    vectors ? queryMemory({ queryvector: vectors, limit: 3, metadata: { chat: messagePayload.chat } }) : Promise.resolve([]),
                    messageModel.find({ chat: messagePayload.chat })
                        .sort({ createdAt: -1 })
                        .limit(20)
                        .lean()
                        .then(res => res.reverse())
                ]);

                const stm = chatHistory.map(item => ({
                    role: item.role === 'model' ? 'model' : 'user',
                    parts: [{ text: item.content }]
                }));

                const validMemoryTexts = (memoryMatches || [])
                    .map(m => m?.metadata?.text)
                    .filter(Boolean);

                const ltm = validMemoryTexts.length > 0 ? [
                    {
                        role: "user",
                        parts: [{
                            text: `Relevant past conversation context:\n${validMemoryTexts.join("\n")}`
                        }]
                    }
                ] : [];

                // 4. Generate AI response
                const responseText = await aiService.generateResponse([...ltm, ...stm]);

                // 5. Save AI response & generate vector
                const [messageResponse, responseVectors] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: responseText,
                        role: "model"
                    }),
                    aiService.generateVector(responseText)
                ]);

                if (responseVectors) {
                    await creatememoryVector({
                        vectors: responseVectors,
                        messageId: messageResponse._id.toString(),
                        metadata: {
                            chat: messagePayload.chat,
                            user: socket.user._id.toString(),
                            text: responseText
                        }
                    });
                }

                // 6. Emit AI response to the chat room
                io.to(messagePayload.chat).emit("ai-message", {
                    content: responseText,
                    chat: messagePayload.chat,
                    chatId: messagePayload.chat,
                    messageId: messageResponse._id.toString()
                });
            } catch (error) {
                console.error("❌ Socket ai-message Error:", error);
                socket.emit("ai-message-error", {
                    message: "Failed to generate AI response. Please try again."
                });
            }
        });

        socket.on("summarize-chat", async (data) => {
            try {
                if (!data || !data.chat || !data.messages) return;
                const summary = await aiService.generateSummary(data.messages);
                io.to(data.chat).emit("ai-summary", {
                    chat: data.chat,
                    chatId: data.chat,
                    summary
                });
            } catch (error) {
                console.error("❌ Error summarizing chat:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("🔌 User disconnected:", socket.id);
        });
    });
}

module.exports = initsocketserver; 