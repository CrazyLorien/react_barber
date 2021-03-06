var LocalStrategy = require('passport-local').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var User = require('../models/user')

module.exports = function (app, passport, flash) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(
        new LocalStrategy(
            function (username, password, done) {
                User.findOne({ name: username }, function (err, user) {
                    if (err) { return done(err, false); }
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (user.password != password) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, user);
                });
            })
    );

    passport.use(new VKontakteStrategy({
            clientID: '4873311', // VK.com docs call it 'API ID'
            clientSecret: 'S3MSa0tR2Ld79vCYDCKf',
            callbackURL: "http://localhost:3001/auth/vkontakte/callback",
            apiVersion: '5.17'
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile)
            User.findOne({ vkId: profile.id },
                function (err, user) {
                    if (err) {
                        console.log(err)
                        throw err;
                    }
                    if (!user) {
                        var user = new User({ name: profile.first_name, password: "defaultPassword", vkId: profile.id });
                        user.save(function (err, user) {
                            console.log(err)
                            if (err) return handleError(err);
                            console.log('newbe user' + user)
                            return done(null, user);
                        })
                    } else {
                        return done(null, user);
                    }
                });
        }
    ));


    app.get('/auth/vkontakte',
        passport.authenticate('vkontakte'),
        function (req, res) {
            // The request will be redirected to vk.com for authentication, so
            // this function will not be called.
        });

    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/admin');
        });

    app.get('/login', function (req, res, next) {
        res.json({ message: req.flash('error') });
    });


    app.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(err);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.json({ detail: user });
            });
        })(req, res, next);
    });

    app.get('/logout', function (req, res) {
        res.clearCookie('connect.sid');
        res.clearCookie('user');
        res.redirect('/');
    })

}

/*
app.post('/login', function(req, res, next) {
    passport.authenticate('loginUsers', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.render('account'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({detail: info});
        });
    })(req, res, next);
});

Also, in your strategy, make sure the fields name are correct ie:

passport.use('loginUsers',new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
*/