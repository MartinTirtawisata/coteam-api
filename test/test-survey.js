const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const expect = chai.expect;

const {TEST_DATABASE_URL} = require('../config');
const {Survey} = require('../models');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

function generateSurveyData(){
    return {
        userQuestion: faker.lorem.sentence(),
        userInput: faker.lorem.word()
    };
};

function seedSurveyData(){
    console.info('seeding survey data');
    let surveyData = [];
    for (let i=0; i < 5; i++){
        surveyData.push(generateSurveyData());
    }
    return Survey.insertMany(surveyData);
}

function tearDownDB(){
    console.info('tearing down database');
    return mongoose.connection.dropDatabase();
}

describe('API route testing for Survey', function(){
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedSurveyData();
    });

    afterEach(function(){
        return tearDownDB();
    })

    after(function(){
        return closeServer();
    })

    describe('GET endpoint for survey', function() {
        it('should retrieve all questions and user inputs', function(){
            let res;
            return chai.request(app).get('/api/survey').then(_res => {
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body).to.not.be.null;
                return Survey.countDocuments()
            }).then(count => {
                expect(res.body).to.not.be.null;
            })
        })
    })
})

