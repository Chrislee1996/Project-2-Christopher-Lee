/////////////////////////////////
// import dependencies
/////////////////////////////////
const mongoose = require('./connection')

//heres an alternate syntax for creating a schema
//reminder we do not need a model for a subdocument
/////////////////////////////////
// define our feeds model
/////////////////////////////////
const { Schema, model } = mongoose

//all we need is a schema 
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required:true
    },
    album: {type: String, required:true},
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User', 
        required: true
    },
},{
    timestamps: true
})

//make our review model
const Review = model("Review", reviewSchema)

module.exports = Review 