const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { compareSync } = require("bcrypt-nodejs");

const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.post('/login', (req, res) => login.handleLogin(req, res, db, compareSync));

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.listen(3000, () => {
    console.log('app is fired!')
});