module.exports = function (app, sha1, generateToken, isDefined, logout, User) {

    // login
    app.post('/login', function (req, res) {
        console.log("Start logging in");
        if (!req.body.userName || !req.body.password) {
            console.error("Login failed: Missing userName and/or password in request");
            return res.status(400).json({
                status: 400,
                message: "Login failed: Missing userName and/or password in request"
            });
        }
        User.findOne({'userName': req.body.userName, 'password': sha1(req.body.userName + req.body.password)},
                '_id userName isAdmin', function (err, user) {
                    if (err) {
                        console.error(err);
                    }
                    if (!user) {
                        return res.status(403).json({
                            status: 403,
                            message: "Login failed: userName or password is incorrect"
                        });
                    } else {
                        var token = generateToken(user.id);
                        console.log("Logged in");
                        res.json({
                            userId: user._id,
                            userName: user.userName,
                            isAdmin: user.isAdmin,
                            token: token
                        });
                    }
                });
    });

    // logout
    app.get('/logout', logout);

    // create user
    app.post('/user', function (req, res) {
        if (!req.body.userName || !req.body.password) {
            console.error("Create user failed: Missing userName and/or password in request");
            return res.status(400).json({
                status: 400,
                message: "Create user failed: Missing userName and/or password in request"
            });
        }
        User.findOne({'userName': req.body.userName}, function (err, user) {
            if (err) {
                console.error(err);
            }
            if (user)
            {
                console.log("Create user failed: Username or email address is already in use");
                return res.status(403).json({
                    status: 403,
                    message: "Create user failed: Username or email address is already in use"
                });
            } else {
                User.create({'userName': req.body.userName, 'email': req.body.email,
                    'password': sha1(req.body.userName + req.body.password)}, function (err, createdUser) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("User created");
                    // add notification settings for new user
                    createdUser.addNotificationSettings();
                    res.json({
                        userId: createdUser._id,
                        userName: createdUser.userName,
                        isAdmin: createdUser.isAdmin,
                    });
                });
            }
        });
    });

    // delete user
    app.delete('/user', function (req, res) {
        if (!req.auth) {
            console.error("Request failed: Not logged in");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Not logged in"
            });
        }
        if (!req.isAdmin) {
            console.error("Request failed: Lacking admin credentials");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Lacking admin credentials"
            });
        }
        if (req.body.userId) {
            User.deleteOne({'_id': req.body.userId}, function (err, result) {
                if (err) {
                    console.error(err);
                }
                return res.sendStatus(200);
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: "Request failed"
            });
        }
    });

    // get user info
    app.get('/user/:userId', function (req, res) {
        if (!req.auth) {
            console.error("Request failed: Not logged in");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Not logged in"
            });
        }
        // only admin or the user himself can fetch profile
        if (!req.isAdmin && req.userID != req.params.userId) {
            console.error("Request failed: Lacking proper credentials");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Lacking proper credentials"
            });
        }
        User.findOne({'_id': req.params.userId},
            '_id userName email isAdmin description profilePhoto', function (err, user) {
                if (err) {
                    console.error(err);
                }
                if (!user) {
                    return res.status(403).json({
                        status: 403,
                        message: "Request failed"
                    });
                }
                res.json({
                    userId: user._id,
                    userName: user.userName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    description: user.description,
                    profilePhoto: user.profilePhoto
                });
            });
    });

    // change password
    app.put('/user/:userId/edit/password', function (req, res) {
        if (!req.auth) {
            return res.status(401).json({
                status: 401,
                message: "Request failed: Not logged in"
            });
        }
        if (!req.isAdmin && req.userID != parseInt(req.params.userId)) {
            return res.status(401).json({
                status: 401,
                message: "Request failed: Lacking proper credentials"
            });
        }
        if (!req.body.password || !req.body.newPassword) {
            return res.status(400).json({
                status: 400,
                message: "Request failed: Missing password(s)"
            });
        }
        User.updateOne({'_id': parseInt(req.params.userId), 'password': sha1(req.body.userName + req.body.password)},
                {$set: {'password': sha1(req.body.userName + req.body.newPassword)}}, function (err, result) {
            if (err) {
                console.error(err);
            }
            if (result)
            {
                return res.sendStatus(200);
            }
        });
    });

    // edit user profile
    app.put('/user/:userId', function (req, res) {
        if (!req.auth || !req.isAdmin) {
            return res.status(401).json({
                status: 401,
                message: "Authorization failed"
            });
        }
        var toUpdate = {};
        if (req.body.description)
        {
            toUpdate["description"] = req.body.description;
        }
        if (req.body.profilePhoto)
        {
            toUpdate["profilePhoto"] = req.body.profilePhoto;
        }
        if (req.body.email)
        {
            toUpdate["email"] = req.body.email;
        }

        if (Object.keys(toUpdate).length > 0) {
            User.findOneAndUpdate({'_id': req.params.userId}, toUpdate, {new : true}, function (err, updatedUser) {
                if (err) {
                    console.error(err);
                }
                if (updatedUser)
                {
                    res.sendStatus(200);
                }
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: "Update user profile failed: missing required input."
            });
        }
    });

    // get list of users
    app.get('/users', function (req, res) {
        if (!req.auth || !req.isAdmin) {
            return res.status(401).json({
                status: 401,
                message: "Request failed: Not logged in"
            });
        } else {
            // only looking for non-admin users
            User.find({'isAdmin': 'false'}, '_id userName email', function (err, users) {
                if (err) {
                    console.error(err);
                }
                if (!users.length) {
                    return res.status(403).json({
                        status: 403,
                        message: "Request failed"
                    });
                } else {
                    res.json({
                        users: users
                    });
                }
            });
        }
    });
};