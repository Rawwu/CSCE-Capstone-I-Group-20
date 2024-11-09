const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('joi');

//Crating user model for database
const User = mongoose.model('User', new mongoose.Schema
({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 10
    },

    password: {
        type: String,
        required: true,
        min: 3,
        max: 10
    }
}));

//Creating Joi Schema for registration validation use
const schema = Joi.object
({
	username: Joi.string().min(3).max(10).required(),
    password: Joi.string().min(3).max(10).required()
});

//defining the register route
router.post('/register', async ( req, res) => {
  // Adding register functionality here (e.g., verify credentials)
  const { username, password } = req.body;
  try 
  {
	  //validating the request
	  const { error } = schema.validate(req.body);
	  if(error)
	  {
		  return res.status(400).send('Enter username or password');
	  }

	  //seeing if the user already exists
	  const existingUser = await User.findOne({ username: req.body.username});
	  if(existingUser)
	  {
		  return res.status(400).send('User already exists');
	  }

	  //hasing the password
	  const salt = await bcrypt.genSalt(10);
	  const hashedPW = await bcrypt.hash(req.body.password, salt);

	  //creating the new user
	  const newUser = new User
	  ({
		  username: req.body.username,
		  password: hashedPW
	  });

	  //saving user info and sending success message or error message if necessary
	  await newUser.save();
	  res.status(201).send('User registered successfully');
  }
  catch(error)
  {
	  res.status(500).send('Error registering user');
  }
  }
});
// Export the router module
module.exports = router;