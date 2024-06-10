// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectId;

// let database;

// async function getDatabase() {
//     const client = await MongoClient.connect('mongodb://localhost:27017');
//     database = client.db('library')

//     if (!database) {
//         console.log("Database not connected");
//     }
//     return database
// }

// module.exports = { getDatabase, ObjectID }

// --------------------------------------------------------------------

const mongoose = require('mongoose')

async function getDatabase() {
    mongoose.connect('mongodb://127.0.0.1:27017/library')
        .then(() => {
            console.log("Database connected!")
        })
        .catch((error) => {
            console.log("Databse connection error: ", error.message);
        })
}

module.exports = { getDatabase }