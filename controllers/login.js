const handleLogin = (db, compareSync) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json('Incorrect form submission.');
    }
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
                        return res.status(401).json('Error with the credentials.');
                    });
            } else {
                res.status(401).json('Error with the credentials.')
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(400).json('error getting user.');
        });
}

module.exports = {
    handleLogin: handleLogin
}