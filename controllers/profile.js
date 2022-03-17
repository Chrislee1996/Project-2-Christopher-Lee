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


// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const profileId = req.params.id
    // console.log(profileId,'this is your profile Id')
	// find the profile
    console.log('this is the profileid', profileId)
	Profile.findById(profileId)
		// -->render if there is a profile
		.then((profile) => {
            console.log(profile,'this is the profile')
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('profiles/edit', { profile, username, loggedIn })
		})
		.catch((err) => {
			console.log(err)
			res.json(err)
		})
})

// update route -> sends a put request to our database
router.put('/:id', (req, res) => {
	// get the id
	const profileId = req.params.id
    // console.log(userId,'this  is your user Id')
	// tell mongoose to update our profile
	Profile.findByIdAndUpdate(profileId, req.body, { new: true })
		// if successful -> redirect to the profile page
		.then((profile) => {
            console.log(profile, 'this is the profile on 77')
			res.redirect(`/profiles/`)
		})
		// if an error, display that
		.catch((error) => res.json(error))
})


// show route
router.get('/:id', (req, res) => {
	// first, we need to get the id
	const profileId = req.params.id
	// then we can find a fruit by its id
	Fruit.findById(profileId)
		// once found, we can render a view with the data
		.then((profile) => {
			console.log('the profile we got\n', profile)
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


//loads users favorite artist
router.post('/', (req,res)=> {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const user  = username
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this is your user',user)
            // console.log('this should output the first song in the array', data)
        res.render('profiles/show', { 
				username, loggedIn,
				user: data.topalbums.album
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid song remember spaces and spell matter!" })
		})
})


// Export the Router
module.exports = router