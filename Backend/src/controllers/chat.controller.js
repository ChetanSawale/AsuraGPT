const chatModel = require('../models/chat.model');
const messageModel = require('../models/mesage.model')

async function createChat(req, res) {

    const { title} = req.body;

    const user =req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    });

    res.status(201).json({
        message: "Chat created successfully",
        chat: {
            id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user:chat.user
        }
    });
}

async function getchats(req, res) {
    try {
        const user = req.user;

        // Find all chats for this user
        const chats = await chatModel.find({ user: user._id });

        // For each chat, fetch its messages
        const chatsWithMessages = await Promise.all(
            chats.map(async (chat) => {
                const messages = await messageModel.find({ chat: chat._id }).sort({ createdAt: 1 }); 
                return {
                    _id: chat._id,
                    title: chat.title,
                    lastActivity: chat.lastActivity,
                    user: chat.user,
                    messages
                };
            })
        );

        res.status(200).json({
            message: "Chats retrieved",
            chats: chatsWithMessages,
        });
    } catch (error) {
        console.error("Error retrieving chats:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    createChat,
    getchats
};