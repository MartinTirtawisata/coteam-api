const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL, CLIENT_ORIGIN} = require('./config');
const socialCardRouter = require('./router/socialCardRouter');
// const userRegistration = require('./users/usersRouter')

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use('/api/social-card', socialCardRouter);
// app.use('/api/register', userRegistration);

// app.get('/api/*', (req, res) => {
// res.json(userInfo);
// });

const PORT = 8080;

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