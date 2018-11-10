'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config')
const { app, runServer, closeServer } = require('../server');
const {User} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;
const jwtSecret = "SOME_SECRET_STRING"

chai.use(chaiHttp);

describe('Auth endpoints', function(){
    const username = "example@email.com";
    const password = "password";

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    after(function(){
        return closeServer();
    })

    beforeEach(function(){
        return User.hashPassword(password).then(password => {
            User.create({
                username, password
            })
        })
    })

    afterEach(function(){
        return User.deleteOne({});
    })

    describe('Test for Login', function(){
        it('should reject requests with no credentials', () => {
            return chai.request(app).post('/api/auth/login').then((res) => {
                expect(res).to.have.status(400);
            });
        });

        it('should reject requests with incorrect usernames', () => {
            return chai.request(app).post('/api/auth/login').send({username: "wrongUsername", password}).then(res => {
                expect(res).to.have.status(401);
            })
        });

        it('should reject requests with incorrect password', () => {
            return chai.request(app).post('/api/auth/login').send({username, password: "wrongPassword"}).then(res => {
                expect(res).to.have.status(401);
            })
        });

        it('should return a valid token', () => {
            return chai.request(app).post('/api/auth/login').send({username, password}).then(res => {
                expect(res).to.have.status(200);
                const token = res.body;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, jwtSecret, {
                    algorithms: ['HS256']
                });
                expect(payload.user).to.deep.equal({
                    username
                });
            });
        });
    })
})