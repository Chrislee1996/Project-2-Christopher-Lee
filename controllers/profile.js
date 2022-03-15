// Import Dependencies
const express = require('express')
const Profile = require('../models/profile')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index page
router.get('/', (req, res) => {
	Profile.find({})
		.then(profiles => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('profiles/index', { profiles, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})



// Export the Router
module.exports = router