'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker')
const expect = chai.expect;

const {TEST_DATABASE_URL} = require('../config')

const {User} = require('../models')
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

function generateUserData(){
    return {
        username: faker.internet.email(),
        password: faker.lorem.word()
    }
}

function seedUserData(){
    console.log('seeding user data');
    const userDataSeed = [];
    for (let i=0; i < 5; i++){
        userDataSeed.push(generateUserData());
    }

    return User.insertMany(userDataSeed);
}

function tearDownDB(){
    return mongoose.connection.dropDatabase();
}

describe("GET User test", function(){
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedUserData();
    })

    afterEach(function(){
        return tearDownDB();
    })

    after(function(){
        return closeServer()
    })

    describe('GET endpoint for user', function(){
        it('should get all the users', () => {
            let res;
            return chai.request(app).get('/api/users').then(_res => {
                res = _res;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                return User.countDocuments();
            }).then(count => {
                expect(res.body).to.not.be.null;
            })
        })
    })
})