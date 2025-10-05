const express = require("express"); 
const router = require("./router/router.js")
const app = express()
const connectingToMongoDb = require("./db/db.js")
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(router)
app.use(cookieParser())

const start = async () => {
  try{
    await mongoDb.connectingToMongoDb()
    app.listen(3000, () => {
      console.log("server running")
    })
  } catch(err){
    console.log(`error > ${err}`)
  }
}

start()

module.exports = app 
