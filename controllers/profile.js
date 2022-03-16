// Import Dependencies
const express = require('express')
const Profile = require('../models/profile')
const fetch = require('node-fetch')


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


router.get('/', (req,res)=> {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    res.render('profile', {username, loggedIn})
})

router.post('/', (req,res)=> {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const user  = username
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this is your user',user)
            // console.log('this should output the first song in the array', data)
        res.render('profile/show', { 
				username, loggedIn,
				user: data.toptracks.track
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid song remember spaces and spell matter!" })
		})
})


router.post('/', (req,res)=> {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const user2 = username
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user2}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            console.log('this should output the first artist in the array', data)
        res.render('profile/show', { 
				username, loggedIn,
				user2: data.topartists.artist
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid artist remember spaces and spell matter!" })
		})
})

// Export the Router
module.exports = router