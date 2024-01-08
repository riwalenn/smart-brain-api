const handleRegister = (db, bcrypt) => (req, res) => {
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
}

module.exports = {
    handleRegister: handleRegister
}