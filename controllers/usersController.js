const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}


//3 days
const maxAge = 3 * 24 * 60 * 60
//the id param comes from the user that was just created when this function is called
const createToken = (id) => {
    //secret to the application hash signature
    return jwt.sign({ id }, config.get('jwtSecret'), { expiresIn: maxAge });
};


module.exports.create_user = async (req, res) =>{
    //get the email and password from the post request
    const {name, email, password, avatar} = req.body;

    try {
        //try to create a user with the email and password provided
        const user = await User.create({name, email, password, avatar});
        //wait for the user const to run and then create a cookie
        const token = createToken(user._id);
        //return a cookie as a response
        res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 })
        //returns a response in json when you use fetch() in the signup view
        res.status(201).json({ user: user._id, token });

    }
    catch (err){
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }
};