'use strict';
// const bycrpt = require('bycrpt');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// userSchema

// socialCardSchema
const socialCardSchema = mongoose.Schema({
    // Connect to user
    first_name: "string",
    last_name: 'string',
    job_title: 'string',
    experience: 'string',
    interest: 'string',
    personality: 'string',
    skill: 'string',
    thought: 'string',
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

const SocialCard = mongoose.model('SocialCard', socialCardSchema);

module.exports = {SocialCard}