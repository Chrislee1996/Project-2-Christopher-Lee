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


//routes

//index route that renders the similar artist page 
router.get('/', (req,res)=> {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    res.render('musicSearch/similarArtist/index', { username, loggedIn })
})

//actual gets the API data and posts it in our show route (also renders the show route)
router.post('/', (req,res)=> {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const artist = req.body.artist
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log(data)
            // console.log('this should output the first artist in the array', data.similarartists.artist[0].name)
        res.render('musicSearch/similarArtist/show', { 
                username, loggedIn,
                artist: data.similarartists.artist,
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid artist remember spaces and spell matter!" })
		})
})


module.exports=router