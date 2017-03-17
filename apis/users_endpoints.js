module.exports = function (app, sha1, generateToken, User) {

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
                    userId: user.id,
                    userName: user.userName,
                    isAdmin: user.isAdmin,
                    token: token
                });
            }
        });
    });

    // create user
    app.post('/user', function (req, res) {
        if (!req.body.userName || !req.body.password) {
            console.error("Create user failed: Missing userName and/or password in request");
            return res.sendStatus(400);
        }
        User.count({$or: [{'userName': req.body.userName}, {'email': req.body.email}]}, function (err, count) {
            if (err) {
                console.error(err);
            }
            if (count >= 1) {
                console.log("Username or email address is already in use.");
                return res.sendStatus(403);
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
                        userId: createdUser.id,
                        userName: createdUser.userName,
                        isAdmin: createdUser.isAdmin,
                    });
                });
            }
        });
    });

    // delete user
    app.delete('/user', function (req, res) {
        if (req.params.userId || req.body.userName) {
            User.findOne({$or: [{'id': req.body.userId}, {'userName': req.body.userName}]}, function (err, user) {
                if (err) {
                    console.error(err);
                }
                if (!user) {
                    return res.sendStatus(403);
                }
                if (user.isAdmin) {
                    User.deleteOne({'id': req.params.userId}, function (err, result) {
                        if (err) {
                            console.error(err);
                        }
                        return res.sendStatus(200);
                    });
                } else {
                    console.error("Delete user failed: Not authorized to delete users");
                    return res.sendStatus(401);
                }
            });
        } else {
            return res.sendStatus(400);
        }
    });

    // get user info
    app.get('/user/:userId/profile', function (req, res) {
        if (req.userID != parseInt(req.params.userId)) {
            console.error("Request failed: Token/userId mismatch");
            return res.sendStatus(401);
        }
        User.findOne({$or: [{'id': req.body.userId}, {'userName': req.body.userName}]},
            '_id userName email isAdmin description profilePhoto', function (err, user) {
            if (err) {
                console.error(err);
            }
            if (!user) {
                return res.sendStatus(403);
            }
            var token = generateToken(user.id);
            res.json({
                userId: user.id,
                userName: user.userName,
                email: user.email,
                isAdmin: user.isAdmin,
                description: user.description,
                profilePhoto: user.profilePhoto,
                token: token
            });
        });
    });

    // change password
    app.put('/user/:userId/edit/password', function (req, res) {
        if (req.userID != parseInt(req.params.userId)) {
            console.error("Request failed: Token/userId mismatch");
            return res.sendStatus(401);
        }
        if (!req.body.oldPassword || (!req.body.password && !req.body.userName)) {
            return res.sendStatus(400);
        }
        User.findOne({'id': req.params.userId, 'password': sha1(req.body.userName + req.body.oldPassword)}, 
            function (err, user) {
            if (err) {
                console.error(err);
            }
            if (!user) {
                return res.sendStatus(403);
            }
            User.updateOne({'id': req.params.userId, 'password': sha1(req.body.userName + req.body.oldPassword)}, 
                {$set: {'password': sha1(req.body.userName + req.body.password)}}, function(err, result) { 
                res.sendStatus(200);
            });
        });
    });

    // edit user profile
    app.put('/user/:userId/edit/profile', function (req, res, next) {
        if (req.userID != parseInt(req.params.userId)) {
            console.error("Request failed: Token/userId mismatch");
            return res.sendStatus(401);
        }
        if (!req.body.description && !req.body.profilePhoto && !req.body.email) {
            return res.sendStatus(400);
        } else {
            next();
        }
    });

    app.put('/user/:userId/edit/profile', function (req, res, next) {
        // change description if specified
        if (req.body.description) {
            User.updateOne({'id': req.params.userId}, {$set: {'description': req.body.description}}, function (err, user) {
                if (err) {
                    console.error(err);
                }
                if (!user) {
                    return res.sendStatus(403);
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    });

    app.put('/user/:userId/edit/profile', function (req, res, next) {
        // change email address if specified
        if (req.body.email) {
            User.count({'email': req.body.email}, function (err, count) {
                if (err) {
                    console.error(err);
                }
                if (count >= 1) {
                    console.log("Email address is already in use.");
                    return res.sendStatus(403);
                } else {
                    User.updateOne({'id': req.params.userId}, {$set: {'email': req.body.email}}, function (err, user) {
                        if (err) {
                            console.error(err);
                        }
                        if (!user) {
                            return res.sendStatus(403);
                        } else {
                            next();
                        }
                    });
                }
            });
        } else {
            next();
        }
    });

    app.put('/user/:userId/edit/profile', function (req, res) {
        // change profile picture if specified
        if (req.body.profilePhoto) {
            User.updateOne({'id': req.params.userId}, {$set: {'profilePhoto': req.body.profilePhoto}}, function (err, user) {
                if (err) {
                    console.error(err);
                }
                if (!user) {
                    return res.sendStatus(403);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(200);
        }
    });

    // get list of users
    app.get('/users', function (req, res) {
        if (req.userID != parseInt(req.params.userId)) {
            console.error("Request failed: Token/userId mismatch");
            return res.sendStatus(401);
        }
        User.findOne({'id': req.params.userId}, function (err, admin) {
            if (err) {
                console.error(err);
            }
            if (!admin) {
                return res.sendStatus(403);
            }
            if (admin.isAdmin) {
                // only looking for non-admin users
                User.find({'isAdmin': 'false'}, '_id userName email' ,function (err, users) {
                    if (err) {
                        console.error(err);
                    }
                    if (!users.length) {
                        return res.sendStatus(403);
                    } else {
                        var token = generateToken(user.id);
                        res.json({
                            users: users,
                            token: token
                        });
                    }
                });
            }
        });
    });
};