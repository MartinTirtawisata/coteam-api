'use strict';

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const JWT_SECRET = "SOME_SECRET_STRING"

const createAuthToken = function(user){
    return jwt.sign({user}, JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());
// user provides username and password to login
router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json(authToken);
})

const jwtAuth = passport.authenticate('jwt', {session: false});
// user exchanges a valid JWT for new one
router.post('/refresh', jwtAuth, (req, res)=>{
    const authToken = createAuthToken(req.user);
    res.json({authToken});
});

module.exports = {router};