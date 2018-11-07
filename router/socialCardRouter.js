'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

// Mock Data
const socialCardInfo = {
    first_name: "Marco",
    last_name: "Polo",
    job_title: "software engineer",
    experience: ["Rebelworks","Bjames"],
    interest: "I like basketball and gaming",
    personality: "Introvert",
    skill: ["React","Node"],
    thought: "teamwork is awesome"
}

// Get a 
router.get('/', jsonParser, (req, res) => {
    // Map to models later
    res.json(socialCardInfo);
})

// Create a new social card
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['job_title', 'experience','interest','peronality','skill','thought'];
    requiredFields.forEach(field => {
        if (!(field in req.body)){
            let message = `the ${field} is missing`;
            console.log(message);
            res.status(400).json({error: message})
        }
    })
})

// Update a social card

// Delete a social card

module.exports = router;