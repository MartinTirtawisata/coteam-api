'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const {User} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('User registration tests', function(){
    const username = "hello@email.com";
    const password = "password";

    before(function(){
        return runServer(TEST_DATABASE_URL);
    })

    afterEach(function(){
        return User.deleteMany({})
    })

    after(function(){
        return closeServer();
    })

    describe('POST endpoint for user registration', () => {
        it('should reject users with missing username', () => {
            return chai.request(app).post('/api/users/register').send({password}).then(res => {
                expect(res).to.have.status(422);
                expect(res.body.reason).to.equal('ValidationError');
                expect(res.body.message).to.equal('Missing field');
                expect(res.body.location).to.equal('username');
            });
        });

        it('should reject users with missing password', () => {
            return chai.request(app).post('/api/users/register').send({username}).then(res => {
                expect(res).to.have.status(422);
                expect(res.body.reason).to.equal('ValidationError');
                expect(res.body.message).to.equal('Missing field');
                expect(res.body.location).to.equal('password');
            });
        });
        it('should reject users with duplicate username', function(){
            return User.create({
                username, 
                password
            }).then(() => {
                return chai.request(app).post('/api/users/register').send({
                    username, 
                    password
                }).then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Username already taken');
                    expect(res.body.location).to.equal('username');
                });
            });
        });

        it('should create a new user', function(){
            return chai.request(app).post('/api/users/register').send({username, password}).then(res => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys('username');
                expect(res.body.username).to.equal(username);
                
                return User.findOne({username})
            }).then(user => {
                expect(user).to.not.be.null;
                expect(user.username).to.equal(username);

                return user.validatePassword(password);
            }).then(correctPassword => {
                expect(correctPassword).to.be.true;
            });
        })
    })
})