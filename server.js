////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const express = require("express")
const middleware = require('./utils/middleware')
const ProfileRouter = require('./controllers/profile')
const UserRouter = require('./controllers/user')
const ArtistRoute = require('./controllers/similarArtist')
const AlbumRoute = require('./controllers/topAlbums')
const SongRoute = require('./controllers/topSongs')
const FeedRoute = require('./controllers/feed')
const CommentRoute = require('./controllers/comment')
const FavoriteArtistRoute  = require('./controllers/favoriteArtist')
const FavoriteAlbumRoute  = require('./controllers/favoriteAlbum')
const FavoriteSongRoute  = require('./controllers/favoriteSong')
const ReviewRoute = require('./controllers/review')
const User = require("./models/user")
// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)

////////////////////
//    Routes      //
////////////////////
app.use('/auth', UserRouter)
app.use('/profiles', ProfileRouter)
app.use('/similarArtist', ArtistRoute)
app.use('/topAlbums', AlbumRoute)
app.use('/topSongs', SongRoute)
app.use('/feed', FeedRoute)
app.use('/comments', CommentRoute)
app.use('/favoriteArtist', FavoriteArtistRoute)
app.use('/favoriteAlbum', FavoriteAlbumRoute)
app.use('/favoriteSong', FavoriteSongRoute)
app.use('/reviews',ReviewRoute)

app.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
	res.render('index.liquid', { loggedIn, username, userId })
})

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
    const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})