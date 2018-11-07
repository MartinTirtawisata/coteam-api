// 'use strict';

// const express = require('express');
// const bodyParser = require('body-parser');
// const router = express.Router();

// const jsonParser = bodyParser.json();

// const userInfo = {
//     first_name: "Martin",
//     last_name: "Tirtawisata",
//     username: "martin@email.com",
//     password: "password",
// };

// router.post('/', jsonParser, (req, res) => {
//     // 1) Check for missing field
//     const requiredFields = ['first_name','last_name','username','password'];
//     const missingField = requiredFields.find(field => !(field in req.body));

//     if(missingField){
//         return res.status(422).json({
//             code: 422,
//             reason: 'ValidationError',
//             message: 'Missing field',
//             location: missingField
//         })
//     }

//     // 2) Check for string fields
//     const stringFields = ['first_name', 'last_name', 'username', 'password'];
//     const nonStringFields = stringFields.find(field => {
//         field in req.body && typeof req.body[field] !== 'string';
//     });

//     if(nonStringFields){
//         return res.status(422).json({
//             code: 422,
//             reason: "ValidationError",
//             message: 'Incorrect field type: expected string',
//             location: nonStringFields
//         });
//     };
//     // 3) Trim whitespaces for username and passwords; users cannot have whitespace for credentials
//     const trimmedFields = ['username', 'password'];
//     // Need to find fields that are not trimmed to trigger error.
//     const nonTrimmedFields = trimmedFields.find(field => {
//         req.body[field].trim() !== req.body[field]
//     })

//     if(nonTrimmedFields){
//         return res.status(422).json({
//             code: 422,
//             reason: "ValidationError",
//             message: "Credentials cannot have whitespaces",
//             location: nonTrimmedFields
//         });
//     };

//     // 4) Create min and max of credentials
//     const sizedFields = {username:{min: 1}, password:{min: 1, max: 72}};
//     // check if field is too small
//     const fieldTooSmall = Object.keys(sizedFields).find(field => {
//         'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
//     });
//     // find too large field
//     const fieldTooLarge = Object.keys(sizedFields).find(field => {
//         req.body[field].trim().length > sizedFields[field].max && 'max' in sizedFields[field]
//     });

//     if(fieldTooSmall || fieldTooLarge){
//         return res.status(422).json({
//             code: 422,
//             reason: "ValidationError",
//             message: fieldTooSmall ? `Must be atleast ${sizedFields[fieldTooSmall].min} characters long` : `Must be atleast ${sizedFields[fieldTooLarge].max} characters long`,
//             location: fieldTooSmall || fieldTooLarge
//         });
//     }

//     // 5) Check for existing username
//     // Use object destructuring to assign req.body values
//     let {username, password, first_name = '', last_name = ''} = req.body;

//     first_name = first_name.trim();
//     last_name - last_name.trim();

//     // return User.find({username}).count().then( => {
//     //     if (count > 0){
//     //         return Promise.reject({
//     //             code: 422,
//     //             reason: 'ValidationError',
//     //             message: 'Username Already Taken',
//     //             location: 'username'
//     //         })
//     //     }
//     // })

    
// })



