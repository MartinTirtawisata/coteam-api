'use strict';
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// userSchema
const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true}
});

UserSchema.methods.serialize = function() {
    return {
        username: this.username || '',
    }
}

UserSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function(password){
    return bcrypt.hash(password, 10);
}

// socialCardSchema
const SocialCardSchema = mongoose.Schema({
    first_name: {type: 'string'},
    last_name: {type: 'string'},
    job_title: {type: 'string'},
    experience: {type: 'string'},
    interest: {type: 'string'},
    personality: {type: 'string'},
    skill: {type: 'string'},
    thought: {type: 'string'},
    createdAt: {type: Date, default: Date.now}
});

SocialCardSchema.virtual('user').get(function(){
    return `${this.first_name} ${this.last_name}`
})

SocialCardSchema.methods.serialize = function(){
    return {
        id: this._id,
        first_name: this.first_name,
        last_name: this.last_name,
        job_title: this.job_title,
        experience: this.experience,
        interest: this.interest,
        personality: this.personality,
        skill: this.skill,
        thought: this.thought
    }
}

const UserInputSchema = mongoose.Schema({input: String})

const QuestionSchema = mongoose.Schema({question: String})

const SurveySchema = mongoose.Schema({
    userQuestions: [QuestionSchema],
    userInputs: [UserInputSchema]
})

// UserResults ref to quesiton and user

SurveySchema.methods.serialize = function(){
    return {
        id: this._id,
        userQuestions: this.userQuestions,
        userInputs: this.userInputs
    }
}

const SocialCard = mongoose.model('SocialCard', SocialCardSchema);
const Survey = mongoose.model('Survey', SurveySchema);
const UserInput = mongoose.model('UserInput', UserInputSchema);
const Question = mongoose.model('Question', QuestionSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {SocialCard, Survey, UserInput, Question, User}