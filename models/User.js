const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    avatar: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }

});

//fire a function before doc saved to db
UserSchema.pre('save', async function (next){
    //encrypt password
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    //get avatar
    this.avatar = gravatar.url(this.email,{
        s: '200',
        r: 'pg',
        d: 'mm'
    })

    next();
});

//static method to login user userSchema.statics.<choose name> =
UserSchema.statics.login = async function(email, password){
    //look in the database for that email provided
    const user = await this.findOne({ email });
    //wait for for user to complete and then check if we have a user with that email
    if(user){
        //if user exist compare the password provided with the one in the database
        const auth = await bcrypt.compare(password, user.password);
        //wait for auth to complete and if same passwords return the user for later use
        if(auth){
            return user;
        }
        //error wrong password provided
        throw Error('incorrect password');

    }
    //error if email is not in the database
    throw Error('incorrect email')
}


const User = mongoose.model('users', UserSchema);

module.exports = User;