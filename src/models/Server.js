const express = require('express');
const cors = require('cors');
const airdropRoutes = require('../routes/airdropRoutes');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3005;
        this.paths = {
            airdrop: '/api/airdrop',
        }

        this.middlewares();
        this.routes();
    }

    middlewares() {
        // Enable CORS
        this.app.use(cors());

        // JSON parser middleware
        this.app.use(express.json());
    }

    routes() {
        // Define your routes here
        this.app.use(this.paths.airdrop, airdropRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

module.exports = Server;