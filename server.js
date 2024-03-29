const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { compareSync } = require("bcrypt-nodejs");

const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image_'); //change image_ to image

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',         // your host
        user : 'postgres',          // your user database login
        password : 'pwd',           // your database password
        database : 'smart-brain'    // your database name
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/profile/:id', profile.handleProfile(db));

app.post('/register', register.handleRegister(db, bcrypt));

app.post('/login', login.handleLogin(db, compareSync));

app.put('/image', image.handleImage(db));

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res)});

app.listen(3000, () => {
    console.log('app is fired!')
});