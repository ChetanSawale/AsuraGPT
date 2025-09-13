const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model");
const aiService = require('../services/ai.service')
const messagerModel = require("../models/mesage.model")
const { creatememoryVector, queryMemory } = require("../services/vector.service")
const generateVector = require('../services/ai.service')


function initsocketserver(httpServer){

    const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://asuragpt-2.onrender.com"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }

    });


    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if(!cookies.token){
            next(new Error("Authentication  error: No token provided"));
        }

        try{
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)

            const user = await userModel.findById(decoded.id);

            socket.user = user

            next()

        } catch (err) {
            next(new Error("Authentication error: Invalid token"))
        }
        
    })

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.user?.email || socket.id);

  socket.on("ai-message", async (messagePayload) => {
    // Join the room for this chatId
    socket.join(messagePayload.chat);

    // Save user message
    const [message, vectors] = await Promise.all([
      messagerModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user"
      }),
      aiService.generateVector(messagePayload.content)
    ]);

    await creatememoryVector({
      vectors,
      messageId: message._id.toString(),  
      metadata: {
        chat: messagePayload.chat,
        user: socket.user._id,
        text: messagePayload.content
      }
    });

    // Get memory + chat history
    const [memory, chatHistory] = await Promise.all([
      queryMemory({ queryvector: vectors, limit: 3, metadata: {} }),
      messagerModel.find({ chat: messagePayload.chat })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
        .then(res => res.reverse())
    ]);

    const stm = chatHistory.map(item => ({
      role: item.role,
      parts: [{ text: item.content }]
    }));

    const ltm = [
      {
        role: "user",
        parts: [{
          text: `
            These are some previous messages from the chat, use them to generate the response:
            ${memory.map(item => item.metadata.text).join("\n")}
          `
        }]
      }
    ];

    const response = await aiService.generateResponse([...ltm, ...stm]);

    const [messageResponse, responseVectors] = await Promise.all([
      messagerModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model"
      }),
      aiService.generateVector(response)
    ]);

    // console.log(messagePayload.chat);


    await creatememoryVector({
      vectors: responseVectors,
      messageId: messageResponse._id.toString(),
      metadata: {
        chat: messagePayload.chat,
        user: socket.user._id,
        text: response
      }
    });

    io.to(messagePayload.chat).emit("ai-message", {
      content: response,
      chat: messagePayload.chat,
      chatid:messagePayload._id
    });
  });
});

}

module.exports = initsocketserver 