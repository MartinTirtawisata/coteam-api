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
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        job_title: faker.name.jobTitle(),
        experience: faker.lorem.word(),
        interest: faker.lorem.words(),
        personality: faker.lorem.word(),
        skill: faker.lorem.word(),
        thought: faker.lorem.sentence(),
        created: faker.date.past()
    }
}

function seedSocialCardData(){
    console.info('seeding social card data');
    let socialCardData = [];
    for (let i=0; i < 5; i++){
        socialCardData.push(generateSocialCardData())
    }
    return SocialCard.insertMany(socialCardData);
}

function tearDownDB(){
    console.info('tearing down the database');
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
        it('should retrieve all social card', function(){
            let res;
            return chai.request(app).get('/api/card').then(_res => {
                res = _res
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);
                return SocialCard.countDocuments()
            }).then(count => {
                expect(res.body).to.have.lengthOf(count);
            })
        })
    })

    describe('POST endpoints for social card', function(){
        it('should add new social card', () => {
            const newSocialCard = {
                    first_name: faker.name.firstName(),
                    last_name: faker.name.lastName(),
                    job_title: faker.name.jobTitle(),
                    experience: faker.lorem.word(),
                    interest: faker.lorem.words(),
                    personality: faker.lorem.word(),
                    skill: faker.lorem.word(),
                    thought: faker.lorem.sentence(),
                    created: faker.date.past()
            };
            return chai.request(app).post('/api/card').send(newSocialCard).then(res => {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res).to.be.a('object');

                return SocialCard.findById(res.body._id)
            })
        });
    });

    describe('PUT endpoint for social card', function(){
        it('should update the social card', () => {
            let updateSocialCard = {
                experience: "B James",
                skill: "Nodejs"
            };
            
            SocialCard.findOne().then(card => {
                updateSocialCard.id = card._id
                let res;

                return chai.request(app).put(`/api/card/${updateSocialCard.id}`).send(updateSocialCard).then(() => {
                    expect(res).to.have.status(204);
                    return SocialCard.findById(updateSocialCard.id)
                }).then(card => {
                    expect(card.experience).to.equal(res.body.experience);
                    expect(card.skill).to.equal(res.body.skill);
                });
            });
        });
    });
})
