'use strict';

var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var contacts = require("./contacts.js");
var users = require("./users.js");
var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    LocalAPIKey = require('passport-localapikey').Strategy;
    
    
passport.use(new BasicStrategy(
    function(username, password, done) {
        users.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.validPassword(password)) { return done(null, false); }
          return done(null, user);
        });
        
    }
));

passport.use(new LocalAPIKey(
  function(apikey, done) {
    users.findOne({ apikey: apikey }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }    
));

var port = (process.env.PORT || 16778);
var baseAPI = "/api/v1";

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get(baseAPI + "/contacts", passport.authenticate('localapikey', {session: false}), (request, response) => {
    console.log("GET /contacts"); 
    
    contacts.allContacts((err,contacts)=>{
        response.send(contacts);    
    });
});

app.post(baseAPI + "/contacts", (request, response) => {
    console.log("POST /contacts");
    var contact = request.body;
    contacts.add(contact);
    response.sendStatus(201);
});

app.delete(baseAPI + "/contacts", (request, response) => {
    console.log("DELETE /contacts");

    contacts.removeAll((err,numRemoved)=>{
        console.log("contacts removed:"+numRemoved);
        response.sendStatus(200);    
    });

});

app.get(baseAPI + "/contacts/:name", (request, response) => {
    console.log("GET /contacts/"+name);
    var name = request.params.name;

    contacts.get(name,(err,contacts)=>{
        if (contacts.length === 0) {
            response.sendStatus(404);
        }
        else {
            response.send(contacts[0]);  
        }
    });
});


app.delete(baseAPI + "/contacts/:name", (request, response) => {
    var name = request.params.name;

    contacts.remove(name,(err,numRemoved)=>{
        console.log("contacts removed:"+numRemoved);
        response.sendStatus(200);    
    });

    console.log("DELETE /contacts/" + name);
});


app.put(baseAPI + "/contacts/:name", (request, response) => {
    var name = request.params.name;
    var updatedContact = request.body;

    contacts.update(name, updatedContact ,(err,numUpdates) => {
        console.log("contacts updated:"+numUpdates);
        if (numUpdates === 0) {
            response.sendStatus(404);    
        } else {
            response.sendStatus(200);    
        }
        
    });

    console.log("UPDATE /contacts/"+name);
});

contacts.connectDb((err) => {
    if (err) {
        console.log("Could not connect with MongoDB");
        process.exit(1);
    }
    
    users.connectDb((err) => {
        if (err) {
            console.log("Could not connect with MongoDB");
            process.exit(1);
        }
        
        app.listen(port, () => {
            console.log("Server with GUI up and running!!");
        });    
    });
    

});
