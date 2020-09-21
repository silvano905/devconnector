const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const requireAuth = require('./middleware/auth')

const app = express();

//connect database
connectDB();


// middleware
app.use(express.static('public'));
//parses incoming requests and it returns an Object.
app.use(express.json());
app.use(cookieParser());
//important get encoded data in the url(post request) and passes an object that we can use
app.use(express.urlencoded({extended: true}));

// view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.send('API running'));

//define routes
app.use('/api/users', requireAuth, require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', requireAuth, require('./routes/api/profile'));
app.use('/api/posts', requireAuth, require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));