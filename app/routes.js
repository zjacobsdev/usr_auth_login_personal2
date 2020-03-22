module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      if(req.user.local.email){
        //console.log(req.user.local)
        db.collection('diary').find().toArray((err, result) => {
          //console.log(result)
          console.log(req)
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user: req.user,
            diary: result,
            pick : null
          })
        })
      }
    });

  //   app.get(`/profile${user.local.email}`, isLoggedIn, function(req, res) {
  //     db.collection('messages').find().toArray((err, result) => {
  //       if (err) return console.log(err)
  //       res.render('profile.ejs', {
  //         user : req.user,
  //         messages: result
  //       })
  //     })
  // });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/diary', (req, res) => {
      let saying =["Maybe", "NO NO NO", "sure", "....","Yaaaas","In your dreams"]
      let pickSaying = Math.floor(Math.random()*6)

      db.collection('diary').save({name: req.body.name, q: req.body.msg, a:saying[pickSaying]}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    // app.put('/diary', (req, res) => {
    //   db.collection('diary')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    app.delete('/diary', (req, res) => {
      console.log(req.body.name)
      console.log(req.body.q)
      db.collection('diary').findOneAndDelete({name:req.body.name, q:req.body.q, a:req.body.a}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
        console.log(req.body.name)
        console.log(req.body.q)
      })

    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
