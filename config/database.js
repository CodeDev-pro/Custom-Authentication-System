const mongoose = require('mongoose');
require('dotenv').config()

const PORT = process.env.PORT || 5000

const mongooseConnection = (server) => {
    return mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => {
      console.log("Connected Succesfully");
      server.listen(PORT, () => {
        console.log(`Server Listening from ${PORT}`);
      });
    })
    .catch((e) => console.log(e));
}

module.exports = mongooseConnection