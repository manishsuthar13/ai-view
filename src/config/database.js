const mongoose = require("mongoose")

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to database")
    }catch(e){
        console.log("Error connecting to the Database ${e.message}")
    }
}

module.exports = connectToDB