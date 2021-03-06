////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const Feed = require('../models/feed')


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

// Routes

// index page for our feed - this will render the page
router.get('/', (req, res) => {
	Feed.find({})
		.then(feeds => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('feeds/index', { feeds, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's feeds(things/topics they made)
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Feed.find({ owner: userId })
		.then(feeds => {
			res.render('feeds/index', { feeds, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our new page with the form 
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('feeds/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document from our new route above
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Feed.create(req.body)
		.then(feed => {
			// console.log('this was returned from create', feed)
			res.redirect(`/feed/mine`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
    const { username, userId, loggedIn } = req.session
	const feedId = req.params.id
	Feed.findById(feedId)
		.then(feed => {
			res.render('feeds/edit', { feed, username, loggedIn, })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route - so we can update whatever we just edited
router.put('/:id', (req, res) => {
	const feedId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Feed.findByIdAndUpdate(feedId, req.body, { new: true })
		.then(feed => {
			res.redirect(`/feed/${feed.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})


//like button - increases our rating by 1 when a action is done
router.put('/:id/feed', (req, res)=> {
    const feedId = req.params.id
    Feed.findByIdAndUpdate( feedId, {$inc: {rating:1}}, {new:true})
    .then(feed=> {
        // console.log('the feed like has increased by 1', feed)
        res.redirect(`/feed/${feed.id}`)
    })
    .catch(error => {
        console.log(error)
        res.json({error})
    })
})


// show route to show the feed page we clicked on
router.get('/:id', (req, res) => {
	const feedId = req.params.id
	Feed.findById(feedId)
    .populate('comments.author')
		.then(feed => {
            const {username, loggedIn, userId} = req.session
			res.render('feeds/show', { feed, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const feedId = req.params.id
	Feed.findByIdAndRemove(feedId)
		.then(feed => {
			res.redirect('/feed')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router