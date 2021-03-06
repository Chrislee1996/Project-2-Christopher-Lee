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

//This will render our index page 
router.get('/', (req,res)=> {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
    res.render('musicSearch/topAlbums/index' ,{username,loggedIn})
})

//This route will fetch our API and post it in our show page
router.post('/', (req,res)=> {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
    const artist = req.body.artist
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${process.env.APIKEY}&format=json`
    fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            // console.log('this should output the 1st album in the array',data.topalbums.album[0])
			// console.log('should link the image of the album', data.topalbums.album[0].image[0])
        res.render('musicSearch/topAlbums/show', {
				username, loggedIn,
                album: data.topalbums.album
            })
        })
        .catch((err) => {
			console.log(err)
			res.json({ err: "Please enter a valid artist remember spaces and spell matter!" })
		})
})


module.exports=router