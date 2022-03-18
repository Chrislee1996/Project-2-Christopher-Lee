////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const List = require('../models/list')

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

// index for our list
router.get('/', (req, res) => {
	// find the fruits
	List.find({})
		// then render a template AFTER they're found
		.then((lists) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			// console.log(fruits)
			res.render('lists/index', { lists, username, loggedIn })
		})
		// show an error if there is one
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	res.render('lists/new', { username, loggedIn })
})


// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.owner = req.session.userId
	List.create(req.body)
		.then((list) => {
			res.redirect('/lists')
		})
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})


// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const listId = req.params.id
	// find the fruit
	List.findById(listId)
		// -->render if there is a fruit
		.then((list) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('lists/edit', { list, username, loggedIn })
		})
		// -->error if no fruit
		.catch((err) => {
			console.log(err)
			res.json(err)
		})
})


// update route -> sends a put request to our database
router.put('/:id', (req, res) => {
	// get the id
	const listId = req.params.id
	Fruit.findByIdAndUpdate(listId, req.body, { new: true })
		// if successful -> redirect to the fruit page
		.then((list) => {
			res.redirect(`/fruits/${list.id}`)
		})
		// if an error, display that
		.catch((error) => res.json(error))
})

// show route
router.get('/:id', (req, res) => {
	// first, we need to get the id
	const listId = req.params.id
	// then we can find a fruit by its id
	List.findById(listId)
		// once found, we can render a view with the data
		.then((list) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId
			res.render('lists/show', { list, username, loggedIn, userId })
		})
		// if there is an error, show that instead
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})

// delete route
router.delete('/:id', (req, res) => {
	// get the fruit id
	const listId = req.params.id
	// delete the fruit
	List.findByIdAndRemove(listId)
		.then((list) => {
			res.redirect('/lists')
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})





////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router