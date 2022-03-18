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


// new route -> GET route that renders our new page with the form
router.get('/new', (req, res) => {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	res.render('profiles/new', { username, loggedIn })
})

// Create Route -> POST route that actually calls the db and makes a new document via from the above route 
router.post('/', (req, res) => {
	req.body.owner = req.session.userId
	Profile.create(req.body)
		.then((profile) => {
			res.redirect('/profiles')
		})
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	let userId = req.session.userId
	Profile.findById(userId)
		.then((profile) => {
			// console.log(userId, 'this is your userId via editing route')
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('profiles/edit', { profile,userId, username, loggedIn })
		})
		.catch((err) => {
			console.log(err)
			res.json(err)
		})
})


//update route - sending the new updated edited item
router.put('/:id', (req, res)=>{
	let userId = req.session.userId
    Profile.findByIdAndUpdate(userId, req.body, {new:true})
        .then(profile=> {
			// console.log(userId, 'this is your userId via updating route')
            res.redirect(`/profiles/`)
        })
        .catch(error => {
            console.log(error)
            res.json({error})
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

// show route
router.get('/:id', (req, res) => {
	let userId = req.session.userId
	Profile.findById(userId)
		.then((profile) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId
			res.render('profiles/show', { profile, username, loggedIn, userId })
		})
		// if there is an error, show that instead
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})


// delete route
router.delete('/:id', (req, res) => {
	let userId = req.session.userId
	Profile.findByIdAndRemove(userId)
		.then((profile) => {
			console.log('you are deleting this',userId)
			res.redirect('/profiles')
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

// Export the Router
module.exports = router