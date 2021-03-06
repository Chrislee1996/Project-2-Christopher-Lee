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
//index - route will render our index page 
router.get('/', (req,res)=> {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
    res.render('musicSearch/topSongs/index' , {username,loggedIn})
})


//This route will fetch our API and will render/post the data in our show route (renders show route too)
router.post('/', (req,res)=> {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
    const song = req.body.song
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${song}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this should output the 1st song in the array',data.toptracks.track[0])
        res.render('musicSearch/topSongs/show', {
				username, loggedIn,
                songs: data.toptracks.track
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid artist remember spaces and spell matter!" })
		})
})


module.exports=router