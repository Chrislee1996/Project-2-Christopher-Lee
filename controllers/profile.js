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




// index ALL profile route
router.get('/', (req, res) => {
	// find the profile
	Profile.find({})
		// then render a template AFTER they're found
		.then((profiles) => {
            const userId = req.session.userId
            // console.log(userId,'this  is your user Id')
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('profiles/index', { profiles, username, loggedIn, userId })
		})
		// show an error if there is one
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})




//loads users favorite album
router.post('/', (req,res)=> {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userFavoriteAlbum  = username
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${userFavoriteAlbum}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this is your user',user)
            // console.log('this should output the first song in the array', data)
        res.render(`profiles/show`, { 
				username, loggedIn,
				userFavoriteAlbum: data.topalbums.album
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid song remember spaces and spell matter!" })
		})
})



// loads users favorite tracks 
router.post('/favoriteTrackShow', (req,res)=> {
	const profileId = req.params.id
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userFavoriteTrack  = username
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${userFavoriteTrack}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this is your user',user)
            // console.log('this should output the first song in the array', data)
        res.render('profiles/favoriteTrackShow', { 
				username, loggedIn,
				userFavoriteTrack: data.toptracks.track
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid song remember spaces and spell matter!" })
		})
})

//loads users favorite artist
router.post('/', (req,res)=> {
	const profileId = req.params.id
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userFavoriteArtist = username
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${userFavoriteArtist}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this is your user',user)
            // console.log('this should output the first song in the array', data)
        res.render('profiles/show', { 
				username, loggedIn,
				userFavoriteArtist: data.topartists.artist
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid song remember spaces and spell matter!" })
		})
})


// Export the Router
module.exports = router