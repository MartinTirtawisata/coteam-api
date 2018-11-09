'use strict';
// const bycrpt = require('bycrpt');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// userSchema

// socialCardSchema
const socialCardSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    job_title: String,
    experience: String,
    interest: String,
    personality: String,
    skill: String,
    thought: String,
    createdAt: {type: Date, default: Date.now}
});

socialCardSchema.virtual('user').get(function(){
    return `${this.first_name} ${this.last_name}`
})

socialCardSchema.methods.serialize = function(){
    return {
        id: this._id,
        user: this.username,
        job_title: this.username,
        experience: this.experience,
        interest: this.interest,
        personality: this.personality,
        skill: this.personality,
        thought: this.thought
    }
}

const userInputSchema = mongoose.Schema({input: String})

const questionSchema = mongoose.Schema({question: String})

const surveySchema = mongoose.Schema({
    userQuestions: [questionSchema],
    userInputs: [userInputSchema]
})

surveySchema.methods.serialize = function(){
    return {
        id: this._id,
        userQuestions: this.userQuestions,
        userInputs: this.userInputs
    }
}

const SocialCard = mongoose.model('SocialCard', socialCardSchema);
const Survey = mongoose.model('Survey', surveySchema);
const UserInput = mongoose.model('UserInput', userInputSchema);
const Question = mongoose.model('Question', questionSchema);

module.exports = {SocialCard, Survey, UserInput, Question}