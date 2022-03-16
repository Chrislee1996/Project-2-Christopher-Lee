/////////////////////////////////
// import dependencies
/////////////////////////////////
const mongoose = require('./connection')

//we need to import our commentSchema
const commentSchema = require('./comment')

/////////////////////////////////
// define our feeds model
/////////////////////////////////
const { Schema, model } = mongoose

//feeds schema
const feedsSchema = new Schema({
    artist: {type: String,required:true},
    song: {type: String},
    album: {type: String},
    opinion: {type: String,required:true },
    rating: {type: Number, min:1, max:1, required:true}, 
    owner: {
        //reference the type objectId
        type: Schema.Types.ObjectID,
        //references the model: 'User'
        ref:'User'
        //now thatwe have an owner field, lets look and replace references to the username in our feed controllers
    },
    comments:[commentSchema]
},{ timestamps: true })


//make our feed model
const Feed = model("Feed", feedsSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Feed