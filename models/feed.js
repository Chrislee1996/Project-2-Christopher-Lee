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
    topic: {type:String, required:true},
    artist: {type: String},
    song: {type: String},
    album: {type: String},
    opinion: {type: String,required:true },
    personalRating: {type: Number, min:0, max:10},
    rating: {type: Number, required:true}, 
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