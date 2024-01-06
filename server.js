const express = require('express');
const e = require("express");

const app = express();

app.use(express.json());

const database = {
  users: [
      {
          id: "123",
          name: 'John',
          email: 'john@gmail.com',
          password: 'cookies',
          entries: 0,
          joined: new Date()
      },
      {
          id: "124",
          name: 'Sally',
          email: 'sally@gmail.com',
          password: 'rockets',
          entries: 0,
          joined: new Date()
      }
  ]
};

app.get('/', (req, res) => {
   res.send('success');
});

app.get('/users', (req, res) => {
    res.json(database.users);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
     let found = false;
    database.users.forEach(user => {
       if (user.id === id) {
           found = true;
           return res.json(user);
       }
    });
    if (!found) {
        res.status(404).json('not found');
    }
});

app.post('/register', (req, res) => {
    let properties = ['name', 'email', 'password'];
    if (req.body && properties.every(propName => req.body[propName] !== null && req.body[propName] !== undefined)) {
        let lastId = database.users[database.users.length-1].id;
        let lastNewId = Number(lastId) + 1;
        database.users.push({
            "id": lastNewId.toString(),
            "name": req.body.name,
            "email": req.body.email,
            "password": req.body.password,
            "entries": 0,
            "joined": new Date()
        });

        res.json(database.users[database.users.length-1]);
    } else {
       res.status(400).json('You need a name, email and password to register !');
    }
});

app.get('/login', (req, res) => {
    let found = false;
    database.users.forEach(user => {
        if (user.email === req.body.email && req.body.password === user.password) {
            found = true;
            return res.json(user);
        }
    });

    if (!found) {
        res.status(404).json('User was not found');
    }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.status(404).json('User was not found');
    }
});

app.listen(3000, () => {
    console.log('app is fired!')
});