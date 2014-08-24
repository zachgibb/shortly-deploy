var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');

var db = require('../app/mongo');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

// new Link({url: "thisdoesn'texist"}).save(function(){
//   Link.find({url: 'thisdoesn\'texist'}).exec(function(err, docs){
//     console.log(err);
//     console.log(docs);
//     Link.remove({url: "thisdoesn'texist"}, function(){
//     });
//   });
// });
exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};


exports.fetchLinks = function(req, res){
  Link.find({}).exec(function(err, docs){
    res.send(200, docs);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }).exec(function(err, found) {
    if (found.length) {
      res.send(200, found[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(function(err, newLink) {
          // console.log(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username })
    .exec(function(err, user) {
      if (!user.length) {
        res.redirect('/login');
      } else {
        user[0].comparePassword(password, user[0].password, function(err, match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username })
    .exec(function(err, user) {
      console.log(user, "is the user");
      if (!user.length) {
        console.log('no user');
        var newUser = new User({
          username: username,
          password: password
        });
        
        newUser.save(function(err, newUser) {
            console.log('trying to save user', err);
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    })
};

exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }).exec(function(err, link) {
    if (!link.length) {
      res.redirect('/');
    } else {
      link[0].visits = link[0].visits + 1;
      return res.redirect(link[0].url);
        // Link.save(function(err, url) {
        //   console.log('from navToLink: ' ,link[0].url);
        // });
    }
  });
};