// Import Dependencies
const express = require('express')
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

// Routes
// index page
router.get('/', (req, res) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('favoriteAlbum/index', {username, loggedIn })
})

router.post('/', (req,res)=> {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const favoriteAlbum = req.body.favoriteAlbum 
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${favoriteAlbum}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this should output the first album in the array', data.topalbums.album[0])
        res.render('favoriteAlbum/show', { 
				username, loggedIn,
				favoriteAlbum: data.topalbums.album
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid album remember spaces and spell matter!" })
		})
})


// Export the Router
module.exports = router