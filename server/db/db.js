const mongoose = require("mongoose")
require("dotenv").config()

const uri = process.env.DB_URI

const connectingToMongoDb = async () => {
  try {
      await mongoose.connect(uri)
      console.log("connected to db")
      console.log(uri)
  } catch(err) {
      return console.log(`error ${err}`)
  }
}

module.exports = connectingToMongoDb 
