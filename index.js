var express = require("express");
var bodyParser = require("body-parser");

var contacts = [{
     name: "pepe",
     phone: "12345",
     email: "pepe@pepe.com"
 }, {
     name: "luis",
     phone: "67890",
     email: "luis@luis.com"
 }];

var baseApi = "/api/v1";

var app = express();
app.use(bodyParser.json());

var port = (process.env.PORT || 3000);

var baseAPI = "/api/v1";


app.get(baseAPI+"/contacts", (request, response) => {
    response.send(contacts);
    console.log("GET /contacts");
});

app.post(baseAPI+"/contacts", (request, response) => {
    
    var contact = request.body;
    contacts.push(contact);
    
    response.sendStatus(201);
    
    console.log("POST /contacts");
});


app.listen(port, () => {
    console.log("Server up and running!!");
});
