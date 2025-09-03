require('dotenv').config();
const app = require('./src/app')
const connectDB = require('./src/db/db');
const httpServer = require('http').createServer(app)
const initsocketserver = require('./src/sockets/socket.server')


connectDB()
initsocketserver(httpServer)

httpServer.listen(3000, ()=> {
    console.log("Server running on 3000");
})