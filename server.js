const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { compareSync } = require("bcrypt-nodejs");

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'pwd',
        database : 'smart-brain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
     db.select('*')
         .from('users')
         .where({id})
         .then(user => {
             if (user.length) {
                 res.json(user[0])
             } else {
                 res.status(404).json('Not found.')
             }
         })
         .catch(err => {
             console.error(err);
             return res.status(404).json('error getting user.');
         });
});

app.post('/register', (req, res) => {
    const properties = ['name', 'email', 'password'];
    const { email, name, password } = req.body;

    const hash = bcrypt.hashSync(password);

    if (req.body && properties.every(propName => req.body[propName] !== null && req.body[propName] !== undefined)) {
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            "name": name,
                            "email":loginEmail[0].email,
                            "joined": new Date()
                        })
                        .then(user => {
                            res.json(user[0]);
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
            .catch(err => {
                console.error(err);
                return res.status(400).json('Unabled to register.');
            });
    } else {
       res.status(400).json('You need a name, email and password to register !');
    }
});

app.post('/login', (req, res) => {
    db.select('*')
        .from('login')
        .where('email', '=', req.body.email)
        .then(data => {
           const isValid = compareSync(req.body.password, data[0].hash);
           if (isValid) {
               return db.select('*').from('users')
                   .where('email', '=', req.body.email)
                   .then(user => {
                       res.json(user[0]);
                   })
                   .catch( err => {
                       console.error(err);
                       return res.status(400).json('Error with the credentials.');
                   });
           } else {
               res.status(400).json('Error with the credentials.')
           }
        })
        .catch(err => {
            console.error(err);
            return res.status(400).json('error getting user.');
        });
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => {
            console.error(err);
            return res.status(400).json('unable to get entries');
        });
});

app.listen(3000, () => {
    console.log('app is fired!')
});