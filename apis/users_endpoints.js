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
            return res.status(400).json({
                status: 400,
                message: "Create user failed: Missing userName and/or password in request"
            });
        }
        User.count({$or: [{'userName': req.body.userName}, 
                {$and: [{'req.body.email':{$type:10}}, {'email': req.body.email}]}]}, function (err, count) {
            if (err) {
                console.error(err);
            }
            if (count >= 1) {
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
            User.deleteOne({'id': req.body.userId}, function (err, result) {
                if (err) {
                    console.error(err);
                }
                return res.status(200).json({
                    status: 200,
                    message: "Request successful"
                }); 
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: "Request failed"
            }); 
        }
    });

    // get user info
    app.get('/user/:userId/profile', function (req, res) {
        if (!req.auth) {
            console.error("Request failed: Not logged in");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Not logged in"
            });
        }
        if (!req.isAdmin && req.userID != req.body.userId) {
            console.error("Request failed: Lacking proper credentials");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Lacking proper credentials"
            }); 
        }   
        User.findOne({'id': req.body.userId},
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
                userId: user.id,
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
            console.error("Request failed: Not logged in");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Not logged in"
            }); 
        }
        if (!req.isAdmin && req.userID != req.body.userId) {
            console.error("Request failed: Lacking proper credentials");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Lacking proper credentials"
            }); 
        }   
        if (!req.body.password || !req.body.newPassword) {
            console.error("Request failed: Missing password(s)");
            return res.status(400).json({
                status: 400,
                message: "Request failed: Missing password(s)"
            });
        }
        User.updateOne({'id': req.body.userId, 'password': sha1(req.body.userName + req.body.password)}, 
            {$set: {'password': sha1(req.body.userName + req.body.newPassword)}}, function(err, result) {
            if (err) {
                console.error(err);
            }
            return res.status(200).json({
                status: 200,
                message: "Request successful"
            });
        });
    });

    // edit user profile
    app.put('/user/:userId/edit/profile', function (req, res, next) {
        if (!req.auth) {
            console.error("Request failed: Not logged in");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Not logged in"
            });
        }
        if (!req.isAdmin && req.userID != req.body.userId) {
            console.error("Request failed: Lacking proper credentials");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Lacking admin credentials"
            });
        }
        if (!req.body.description && !req.body.profilePhoto && !req.body.email) {
            console.error("Request failed: Missing inputs");
            return res.status(400).json({
                status: 400,
                message: "Request failed: Missing inputs"
            });
        } else {
            next();
        }
    });

    app.put('/user/:userId/edit/profile', function (req, res, next) {
        // change description if specified
        if (req.body.description) {
            User.updateOne({'id': req.body.userId}, {$set: {'description': req.body.description}}, function (err, user) {
                if (err) {
                    console.error(err);
                }
                if (!user) {
                    return res.status(403).json({
                        status: 403,
                        message: "Request failed"
                    }); 
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
                    console.log("Request failed: Email address is already in use");
                    return res.status(403).json({
                        status: 403,
                        message: "Request failed: Email address is already in use"
                    }); 
                } else {
                    User.updateOne({'id': req.body.userId}, {$set: {'email': req.body.email}}, function (err, user) {
                        if (err) {
                            console.error(err);
                        }
                        if (!user) {
                            return res.status(403).json({
                                status: 403,
                                message: "Request failed"
                            }); 
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
            User.updateOne({'id': req.body.userId}, {$set: {'profilePhoto': req.body.profilePhoto}}, function (err, user) {
                if (err) {
                    console.error(err);
                }
                if (!user) {
                    return res.status(403).json({
                        status: 403,
                        message: "Request failed"
                    }); 
                } else {
                    return res.status(200).json({
                        status: 200,
                        message: "Request successful"
                    }); 
                }
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "Request successful"
            });
        }
    });

    // get list of users
    app.get('/users', function (req, res) {
        if (!req.auth) {
            console.error("Request failed: Not logged in");
            return res.status(401).json({
                status: 401,
                message: "Request failed:: Not logged in"
            }); 
        }
        if (!req.isAdmin) {
            console.error("Request failed: Lacking admin credentials");
            return res.status(401).json({
                status: 401,
                message: "Request failed: Lacking admin credentials"
            }); 
        } else {
            // only looking for non-admin users
            User.find({'isAdmin': 'false'}, '_id userName email' ,function (err, users) {
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