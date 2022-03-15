////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const mongoose = require('mongoose')

// we need our Fruit MODEL because comments are ONLY a schema
// so we'll run queries on fruits, and add in comments
const Feed = require('../models/feed')

////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// only need two routes for comments right now
// POST -> to create a comment
router.post('/:feedId', (req, res) => {
    const feedId = req.params.fruitId
    console.log('first comment body', req.body)
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    console.log('updated comment body', req.body)
    // we'll find the fruit with the fruitId
    Fruit.findById(feedId)
        .then(feed => {
            // then we'll send req.body to the comments array
            feed.comments.push(req.body)
            // save the fruit
            return feed.save()
        })
        .then(feed => {
            // redirect
            res.redirect(`/feeds/${feed.id}`)
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

// DELETE -> to destroy a comment
// we'll use two params to make our life easier
// first the id of the fruit, since we need to find it
// then the id of the comment, since we want to delete it
router.delete('/delete/:feedId/:commId', (req, res) => {
    // first we want to parse out our ids
    const feedId = req.params.feedId
    const commId = req.params.commId
    // then we'll find the fruit
    Fruit.findById(feedId)
        .then(feed => {
            const theComment = feed.comments.id(commId)
            // only delete the comment if the user who is logged in is the comment's author
            if ( theComment.author == req.session.userId) {
                // then we'll delete the comment
                theComment.remove()
                // return the saved fruit
                return feed.save()
            } else {
                return
            }

        })
        .then(feed => {
            // redirect to the fruit show page
            res.redirect(`/feeds/${feedId}`)
        })
        .catch(error => {
            // catch any errors
            console.log(error)
            res.send(error)
        })
})

////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router