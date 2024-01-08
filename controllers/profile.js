const handleProfile = (db) => (req, res) => {
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
}

module.exports = {
    handleProfile: handleProfile
}