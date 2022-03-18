const express = require('express')
const fetch = require('node-fetch')



//create router
const router = express.Router()


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



//routes - this route posts the top song charts in the home page
router.get('/', (req,res)=> {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
	const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log(data.tracks.track,'charts data')
        res.render('homepage/index', {
				username, loggedIn,
				toptracks: data.tracks.track
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid artist remember spaces and spell matter!" })
		})
})


//routes - this route posts the top artist charts in the home page (after clicking the redirect link)
router.get('/artistCharts', (req,res)=> {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
	const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log(data.artists.artist,'charts data')
        res.render('homepage/artistCharts', {
				username, loggedIn,
				topartists: data.artists.artist
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid artist remember spaces and spell matter!" })
		})
})

//routes - this route posts the top genre charts in the home page (after clicking the redirect link)
router.get('/genre', (req,res)=> {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
	const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptags&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('you are hitting your genre route')
        res.render('homepage/genre', {
				username, loggedIn,
				tags: data.tags.tag
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid artist remember spaces and spell matter!" })
		})
})

module.exports=router