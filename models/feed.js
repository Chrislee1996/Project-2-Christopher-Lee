/////////////////////////////////
// import dependencies
/////////////////////////////////
const mongoose = require('./connection')

/////////////////////////////////
// define our feeds model
/////////////////////////////////
const { Schema, model } = mongoose

//feeds schema
const feedsSchema = new Schema({
    artist: {type: String,required:true},
    comment: {type: String,required:true },   
},{ timestamps: true })


//make our feed model
const Feed = model("Feed", feedsSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Feed