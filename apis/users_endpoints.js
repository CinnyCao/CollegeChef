module.exports = function (app, sha1, generateToken, User) {

    // login
    app.post('/login', function (req, res) {
        console.log("Start logging in");
        if (!req.body.userName || !req.body.password) {
            console.error("Login failed: Missing userName and/or password in request");
            return res.sendStatus(400);
        }
        User.findOne({'userName': req.body.userName, 'password': sha1(req.body.userName + req.body.password)},
            '-_id id userName isAdmin', function (err, user) {
            if (err) {
                console.error(err);
            }
            if (!user) {
                console.log("Login failed: userName or password is incorrect");
                return res.sendStatus(403);
            } else {
                var token = generateToken(user.id);
                console.log("Logged in");
                res.json({
                    userId: user.id,
                    userName: user.userName,
                    isAdmin: user.isAdmin,
                    token: token
                });
            }
        });
    });
};