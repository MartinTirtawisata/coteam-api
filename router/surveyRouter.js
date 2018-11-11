'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');

const {Survey} = require('../models');

const surveyQuestionData = {
    userQuestions: ['rate your team engagement?','rate your comfortability?'],
    userInputs: ['8', '9']
}

// const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jsonParser, (req, res) => {
    res.json({
        survey: [
            {
                question: "Question 1"
            }, 
            {
                question: "Question 2"
            }
        ]
    });
    // res.status(200).json(surveyQuestionData);
    // Survey.find().then(surveys => {
    //     res.status(200).json(surveys.map(survey => {
    //         survey.serialize();
    //     }));
    // }).catch(err => {
    //     res.status(500).json({message: "something went wrong"});
    // })
})

module.exports = router;