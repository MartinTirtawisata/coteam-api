'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/react-api';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/react-api';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://localhost:3000/';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';