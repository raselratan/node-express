// External import
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const loginRouter = require('./router/loginRouter');
const usersRouter = require('./router/usersRouter');
const inboxRouter = require('./router/inboxRouter');


// Internal import
const { notFoundHandler, errorHandler} = require('./middlewares/common/errorHandler');
const app = express();
dotenv.config();


// DB Connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => console.log('Database connection successfull'))
.catch(err => console.log(err));

// Request process
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// View engine setup
app.set("view engine", "ejs");

// Static folder setup
app.use(express.static(path.join(__dirname, "public")));

// Cookie parser setup
app.use(cookieParser(process.env.COOKIE_SECRETE));

// routing
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/inbox', inboxRouter);


// 404 error 
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);


app.listen(3000, () => {
    console.log(`app running at 3000`)
})