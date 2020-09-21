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


//login user
module.exports.login_user = async (req, res) =>{
    //get the email and password from the post request
    const {email, password} = req.body;
    try {
        //try to login user with the email and password provided
        const user = await User.login(email, password);
        //wait for the user const to run and then create a cookie
        const token = createToken(user._id);
        //return a cookie as a response
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        //returns a response in json when you use fetch() in the login view
        res.status(200).json({ user: user._id });

    }
    catch (err){
        const errors = handleErrors(err);
        //return all errors as json when you call fetch() to login view
        res.status(400).json({ errors });
    }
};


module.exports.logout_get = (req, res) => {
    //get the cookie and change maxAgo to i millisecond so that the cookie expires and we logout the current user
    res.cookie('jwt', '', { maxAge: 1 });
    //after logout successful redirect the user to homepage
    res.status(200).json('logout successful');
};


//this was moved to usersController
// module.exports.user_info = async (req, res) =>{
//     try {
//         const user = await User.findById(req.user).select('-password');
//         console.log(req.user)
//         console.log(req.cookies.jwt)
//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// }