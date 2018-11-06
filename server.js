const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL, CLIENT_ORIGIN} = require('./config');
const socialCardRouter = require('./router/socialCardRouter');
const userRegistration = require('./users/usersRouter')

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use('/api', socialCardRouter);
app.use('/api/register', userRegistration);

// app.get('/api/*', (req, res) => {
// res.json(userInfo);
// });

const PORT = 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};