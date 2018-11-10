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

SocialCardSchema.virtual('user').get(function(){
    return `${this.first_name} ${this.last_name}`
})

SocialCardSchema.methods.serialize = function(){
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

const UserInputSchema = mongoose.Schema({input: String})

const QuestionSchema = mongoose.Schema({question: String})

const SurveySchema = mongoose.Schema({
    userQuestions: [QuestionSchema],
    userInputs: [UserInputSchema]
})

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