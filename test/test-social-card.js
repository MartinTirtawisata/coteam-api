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
    console.info('seeding product data');
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
        it('should retrieve one social card', function(){
            let res
            return chai.request(app).get('/api/social-card').then(_res => {
                res = _res
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);
                return socialCardCount.count()
            }).then(count => {
                expect(res.body).to.have.lengthOf(count);
            }).catch(err => {
                console.error(err);
                res.status(500).json({error: err});
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
            expect(res.body).to.include.keys(['first_name','last_name','job_title','experience','interest','personality','skill','thought']);
            expect(res.body.first_name).to.equal(newSocialCard.first_name);
            expect(res.body.last_name).to.equal(newSocialCard.last_name);
            expect(res.body.job_title).to.equal(newSocialCard.job_title);
            expect(res.body.experience).to.equal(newSocialCard.experience);
            expect(res.body.interest).to.equal(newSocialCard.interest);
            expect(res.body.personality).to.equal(newSocialCard.personality);
            expect(res.body.skill).to.equal(newSocialCard.skill);
            return SocialCard.findById(res.body._id)
        }).then(card => {
            expect(card.first_name).to.equal(newSocialCard.first_name);
            expect(card.last_name).to.equal(newSocialCard.last_name);
            expect(card.job_title).to.equal(newSocialCard.job_title);
            expect(card.experience).to.equal(newSocialCard.experience);
            expect(card.interest).to.equal(newSocialCard.interest);
            expect(card.personality).to.equal(newSocialCard.personality);
            expect(card.skill).to.equal(newSocialCard.skill);
        }).catch(err => {
            console.error(err);
            res.status(500).json({error: err})
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

                return chai.request(app).put('/api/social-card').send(updateSocialCard).then(res => {
                    expect(res).to.have.status(204);
                    expect(res).to.be.a.json;
                    expect(res.body.experience).to.equal(updateSocialCard.experience);
                    expect(res.body.skill).to.equal(updateSocialCard.skill);
                    return SocialCard.findById(updateSocialCard.id)
                }).then(card => {
                    expect(card.experience).to.equal(res.body.experience);
                    expect(card.skill).to.equal(res.body.skill);
                    expect(card.id).to.equal(res.body._id);
                }).catch(err => {
                    console.error(err);
                    res.status(500).json({error: err});
                });
            });
        });
    });

    describe('DELETE endpoint for social card', () => {
        it('should delete social card and db = null', () => {
            SocialCard.findOne(card => {
                let cardId = card._id
                return chai.request(app).delete(`/api/social-card/${cardId}`).then(res => {
                    expect(res).to.have.status(204);
                    return SocialCard.findById(cardId);
                }).then(card => {
                    expect(card).to.be.null
                }).catch(err => {
                    console.error(err);
                    res.status(500).json({error: err})
                })
            });
        });
    });
})
