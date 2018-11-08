'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const {SocialCard} = require('../models');

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

// GET socialCard
router.get('/', jsonParser, (req, res) => {
    // res.json(socialCardInfo)
    SocialCard.find().then(card => {
        res.json(card);
    }).catch(err => {
        console.log(err);
        res.status(400).json({message: err})
    })
})

// Create a new social card
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['job_title', 'experience','interest','personality','skill','thought'];
    requiredFields.forEach(field => {
        if (!(field in req.body)){
            let message = `the ${field} is missing`;
            console.log(message);
            res.status(400).json({error: message})
        }
    });

    SocialCard.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        job_title: req.body.job_title,
        experience: req.body.experience,
        interest: req.body.interest,
        personality: req.body.personality,
        skill: req.body.skill,
        thought: req.body.thought
    })

    res.status(201).end()
})

// Update a social card
router.put('/:id', jsonParser, (req, res)=> {
    socialCardUpdate = {};
    fieldsToUpdate = ['job_title', 'experience','interest','peronality','skill','thought'];
    fieldsToUpdate.forEach(field => {
        if (field in req.body){
            socialCardUpdate[field] = req.body[field];
        };
    });

    SocialCard.findByIdAndUpdate(req.params.id, {$set: socialCardUpdate}).then(card => {
        res.status(203).json(card).end();
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
})

// Delete a social card
router.delete('/:id', jsonParser, (req, res) => {
    SocialCard.findByIdAndRemove(req.params.id).then(card => {
        res.status(204).end()
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
})

module.exports = router;