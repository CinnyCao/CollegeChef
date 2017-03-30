module.exports = function (app, Feedback) {

    // send feedback to database
    app.post('/feedback', function (req, res) {
        if (!req.body.feedback) {
            console.error("Could not submit: Missing feedback");
            return res.status(400).json({
                status: 400,
                message: "Could not submit: Missing feedback"
            });
        }
        Feedback.create({'feedback': req.body.feedback, 'name': req.body.name, 
            'email': req.body.email}, function (err, newFeedback) {
            if (err) {
                return console.error(err);
            }
            res.json({
                feedbackId: newFeedback._id,
                feedback: newFeedback.feedback,
                name: newFeedback.name,
                email: newFeedback.email
            });
        });
    });

    // get feedback list
    app.get('/feedback', function (req, res) {
        if (!req.auth || !req.isAdmin) {
            return res.status(401).json({
                status: 401,
                message: "Request failed: Authentication failed"
            });
        } else {
            Feedback.find({}, function (err, fb) {
                if (err) {
                    console.error(err);
                }
                if (!fb.length) {
                    return res.status(403).json({
                        status: 403,
                        message: "No feedback found."
                    });
                } else {
                    res.json(fb);
                }
            });
        }
    });
};