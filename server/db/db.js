const { Admin } = require("mongodb")
const mongoose = require("mongoose")
require("dotenv").config()

const uri = process.env.DB_URI

const connectingToMongoDb = async () => {
    try {
        await mongoose.connect(uri)
    } catch(err) {
        return console.log(`error ${err}`)
    }
}


module.exports = connectingToMongoDb 
