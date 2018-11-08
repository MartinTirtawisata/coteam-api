const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const expect = chai.expect;

const {TEST_DATABASE_URL} = require('../config');
const {SocialCard} = require('../models');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

function generateSocialCardData(){
    return {
        first_name: faker.lorem.words(),
        last_name: faker.lorem.words(),
        job_title: faker.lorem.words(),
        exprience: faker.lorem.words(),
        interest: faker.lorem.words(),
        personality: faker.lorem.words(),
        skill: faker.lorem.words(),
        thought: faker.lorem.words()
    }
}

function seedSocialCardData(){
    console.log('seeding product data');
    let socialCardData = [];
    for (let i=0; i < 5; i++){
        socialCardData.push(generateSocialCardData())
    }

    return SocialCard.insertMany(socialCardData);
}

function tearDownDB(){
    console.log('tearing down the database');
    return mongoose.connection.dropDatabase();
}

describe('API route testing for Social Card', function(){
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedSocialCardData();
    })

    afterEach(function(){
        return tearDownDB();
    })

    after(function(){
        return closeServer();
    })

    describe('GET endpoint for social card', function(){
        it('should retrieve one social card', function(){
            let res
            return chai.request(app).get('/api/social-card').then(_res => {
                res = _res
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);
                return socialCardCount.count()
            }).then(count => {
                expect(res.body).to.have.lengthOf(count);
            })
        })
    })

    describe('POST endpoints for social card', function(){
        let newSocialCard = {
            first_name: "Marco",
            last_name: "Polo",
            job_title: "software engineer",
            experience: ["Rebelworks","Bjames"],
            interest: "I like basketball and gaming",
            personality: "Introvert",
            skill: ["React","Node"],
            thought: "teamwork is awesome"
        };

        return chai.request(app).post('/api/social-card').send(newSocialCard).then(res => {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res).to.be.a('object');
            expect(res.body).to.include.keys(['first_name','last_name','job_title','experience','interest','personality','skill','thought'])
        })
    })
})
