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
    SocialCard.find().then(cards => {
        res.json(cards.map(card => card.serialize()));
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: "Something went wrong"})
    })
})

// Create a new social card
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['job_title', 'experience','interest','personality','skill','thought'];
    requiredFields.forEach(field => {
        if (!(field in req.body)){
            let message = `the ${field} is missing`;
            console.error(message);
            return res.status(400).send(message);
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
    }).then(cards => res.status(201).json(cards.serialize()))
    .catch( err => {
        console.error(err);
        res.status(500).json({error: "Something went wrong"})
    })
})

// Update a social card
router.put('/:id', jsonParser, (req, res)=> {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)){
        res.status(400).json({message: "Request path id and request body id values must match"});
    }

    const socialCardUpdate = {};
    const fieldsToUpdate = ['job_title', 'experience','interest','peronality','skill','thought'];
    fieldsToUpdate.forEach(field => {
        if (field in req.body){
            socialCardUpdate[field] = req.body[field];
        };
    });

    SocialCard.findByIdAndUpdate(req.params.id, {$set: socialCardUpdate}).then(updatedCard => {
        res.status(204).json(updatedCard).end();
    }).catch(err => {
        console.log(err);
        res.status(500).json({message: 'something went wrong'});
    })
})

// Delete a social card
router.delete('/:id', jsonParser, (req, res) => {
    SocialCard.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).json({message: "Delete successful"})
    }).catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

module.exports = router;