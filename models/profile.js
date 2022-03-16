// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')


// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const profileSchema = new Schema(
	{
		favoriteAlbums: { type: String, required: true },
		favoriteSongs: {type: String, required: true },
		favoriteArtist: {type: String, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
	},
)

const Profile = model('Profile', profileSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Profile
