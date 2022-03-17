////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const Review = require('../models/review')


////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

////////////////////////////////////////////
// Router Middleware
////////////////////////////////////////////
// create some middleware to protect these routes
// Authorization middleware
router.use((req, res, next) => {
	// checking the loggedin boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/user/login')
	}
})



////////////////////////////////////////////
// Routes
////////////////////////////////////////////

//Renders our index page
router.get('/', (req,res) => {
    //find the reviews
    Review.find({})
    .then((reviews) => {
        const username = req.session.username
        const loggedIn = req.session.loggedIn
        res.render('reviews/index', {reviews , username,loggedIn})
    })
    .catch((error) => {
        console.log(error)
        res.json({ error })
    })
})



//Show Route

////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router