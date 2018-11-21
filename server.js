require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const {DATABASE_URL, CLIENT_ORIGIN, PORT} = require('./config');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const socialCardRouter = require('./router/socialCardRouter');
const usersRouter = require('./users/usersRouter')
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth')

app.use(cors({
    origin: CLIENT_ORIGIN 
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
});


passport.use(localStrategy);
passport.use(jwtStrategy)
app.use('/api/card', socialCardRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

let server;

function runServer(database_url, port = PORT){
    return new Promise((resolve, reject) => {
        mongoose.connect(database_url, {useNewUrlParser: true}, err => {
            if (err){
                return reject(err);
            }

            server = app.listen(port, () => {
                console.log(`You are listening on port ${port}`)
                resolve();
            }).on('error', function(err){
                mongoose.disconnect();
                reject(err);
            })
        })
    })
}

function closeServer(){
    return mongoose.disconnect().then(function(){
        return new Promise((resolve, reject) => {
            console.log('closing server');
            server.close(function(err){
                if(err){
                    return reject(err);
                }
                resolve();
            })
        })
    })
}

if (require.main === module){
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};