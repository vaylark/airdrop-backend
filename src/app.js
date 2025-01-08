require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const Server = require('./models/Server');

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => console.error('Database connection error:', err));

const server = new Server();
server.listen();