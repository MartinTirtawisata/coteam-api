'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const jsonParser = bodyParser.json();

const userInfo = {
    first_name: "Martin",
    last_name: "Tirtawisata",
    email: "martin@email.com",
    password: "password",
};

router.post('/register', jsonParser, (req, res) => {
    const requiredFields = ['first_name','last_name','email','password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if(missingField){
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        })
    }
})



