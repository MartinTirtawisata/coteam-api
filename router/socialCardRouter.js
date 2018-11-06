'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

// Mock Data
const socialCardInfo = {
    job_title: "software engineer",
    experience: ["Rebelworks","Bjames"],
    skill: ["React","Node"],
    thoughts: "teamwork is awesome"
}

router.get('/social-card', jsonParser, (req, res) => {
    res.json(socialCardInfo;
})