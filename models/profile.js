// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// import our commentSchema
const commentSchema = require('./comment')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const profileSchema = new Schema(
	{
		name: { type: String, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
		comments:[commentSchema]
	},
	{ timestamps: true }
)

const Profile = model('Profile', profileSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Profile
