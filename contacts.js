var path = require('path');
var dataStore = require('nedb');
var dbFileName = path.join(__dirname, 'contacts.json');

var db = new dataStore({
    filename : dbFileName,
    autoload : true
});

db.insert([{
        name: "pepe",
        phone: "12345",
        email: "pepe@pepe.com"
    }, {
        name: "luis",
        phone: "67890",
        email: "luis@pepe.com",
    }]);


var Contacts = function () {};

Contacts.prototype.allContacts = function(callback) {
    return db.find({}, callback);
};

Contacts.prototype.add = function(contact) {
    return db.insert(contact);
};

Contacts.prototype.removeAll = function(callback) {
    return db.remove({},{ multi: true},callback);
};

Contacts.prototype.get = function(name, callback) {
    return db.find({name:name}, callback);
};

Contacts.prototype.remove = function(name, callback) {
    return db.remove({name:name},{ multi: true}, callback);
};

Contacts.prototype.update = function(name, updatedContact, callback) {
    return db.update({name:name},updatedContact,{}, callback);
};

module.exports = new Contacts();