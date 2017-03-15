'use strict';

var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var contacts = require("./contacts.js");

var port = (process.env.PORT || 16778);
var baseAPI = "/api/v1";

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

contacts.add([{
        name: "pepe",
        phone: "12345",
        email: "pepe@pepe.com"
    }, {
        name: "luis",
        phone: "67890",
        email: "luis@pepe.com"
    }]);

app.get(baseAPI + "/contacts", (request, response) => {
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


app.listen(port, () => {
    console.log("Server with GUI up and running!!");
});