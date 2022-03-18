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
            let userId = req.session.userId
            // console.log(userId,'this  is your user Id')
			let username = req.session.username
			let loggedIn = req.session.loggedIn
			res.render('profiles/index', { profiles, username, loggedIn, userId })
		})
		// show an error if there is one
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

//creates users favroite album index 
router.get('/favoriteAlbum', (req, res) => {
	// find the profile
	Profile.find({})
		// then render a template AFTER they're found
		.then((profiles) => {
            let userId = req.session.userId
            // console.log(userId,'this  is your user Id')
			let username = req.session.username
			let loggedIn = req.session.loggedIn
	res.render('profiles/favoriteAlbum',{ profiles, username, loggedIn, userId })
})
// show an error if there is one
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

//loads users favorite album per the API
router.post('/favoriteAlbum', (req,res)=> {
	let username = req.session.username
	let loggedIn = req.session.loggedIn
	let userFavoriteAlbum  = username
    let url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${userFavoriteAlbum}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('you are hitting your album route')
            // console.log('this should output the first song in the array', data)
        res.render(`profiles/favoriteAlbum`, { 
				username, loggedIn,
				userFavoriteAlbum: data.topalbums.album
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid song remember spaces and spell matter!" })
		})
})



//creates/renders users favroite track index page
router.get('/favoriteTrack', (req, res) => {
	// find the profile
	Profile.find({})
		// then render a template AFTE	R they're found
		.then((profiles) => {
			// console.log('you are hitting your track route')
            let userId = req.session.userId
            // console.log(userId,'this  is your user Id')
			let username = req.session.username
			let loggedIn = req.session.loggedIn
	res.render('profiles/favoriteTrack',{ profiles, username, loggedIn, userId })
})
// show an error if there is one
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

// loads users favorite tracks via API
router.post('/favoriteTrack', (req,res)=> {
	let profileId = req.params.id
	let username = req.session.username
	let loggedIn = req.session.loggedIn
	let userFavoriteTrack  = username
    let url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${userFavoriteTrack}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this is your user',user)
            // console.log('this should output the first song in the array', data)
        res.render('profiles/favoriteTrack', { 
				username, loggedIn,
				userFavoriteTrack: data.toptracks.track
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid song remember spaces and spell matter!" })
		})
})


//creates users favroite artist index page
router.get('/favoriteArtist', (req, res) => {
	// find the profile
	Profile.find({})
		// then render a template AFTER they're found
		.then((profiles) => {
            let userId = req.session.userId
            // console.log(userId,'this  is your user Id')
			let username = req.session.username
			let loggedIn = req.session.loggedIn
	res.render('profiles/favoriteArtist',{ profiles, username, loggedIn, userId })
})
// show an error if there is one
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

// //loads users favorite artist via the API
router.post('/favoriteArtist', (req,res)=> {
	let profileId = req.params.id
	let username = req.session.username
	let loggedIn = req.session.loggedIn
	let userFavoriteArtist = username
    let url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${userFavoriteArtist}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this is your user',user)
            // console.log('this should output the first song in the array', data)
        res.render('profiles/favoriteArtist', { 
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