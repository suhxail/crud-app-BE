const config = require('./utils/config');
const mongoose = require("mongoose");
const app = require('./app');

mongoose.connect(config.MONGO_URL)
    .then(() => {
        app.listen(config.PORT, () => {
            console.log(`Server running on PORT ${config.PORT}`)
        })
    })
    .catch ((error) => {
        console.error('Error connecting to MongoDB', error)
    })
