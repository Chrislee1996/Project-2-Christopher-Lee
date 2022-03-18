/////////////////////////////////
// import dependencies
/////////////////////////////////
const mongoose = require('./connection')

/////////////////////////////////
// define our feeds model
/////////////////////////////////
const { Schema, model } = mongoose

//feeds schema
const listSchema = new Schema({
    artist: {type: String, required:true},
    album: {type: String},
    song: {type: String},
    link: {type: String},
    owner: {
        //reference the type objectId
        type: Schema.Types.ObjectID,
        //references the model: 'User'
        ref:'User'
        //now thatwe have an owner field, lets look and replace references to the username in our feed controllers
    },
},{ timestamps: true })


//make our feed model
const List = model("List", listSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = List