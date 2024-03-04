const dotenv = require('dotenv')
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY

module.exports = {
    MONGO_URL,
    PORT,
    SECRET_KEY
}