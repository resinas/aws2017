'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var contacts = require('../contacts.js');

describe('Contacts', function() {
    beforeEach(function(done) {
        contacts.connectDb((err) => {
            if (err) {
                return done(err);
            }
            
        
            contacts.removeAll(function(err) {
                if (err) {
                    return done(err);
                }
                
                contacts.add([{
                    name: "pepe",
                    phone: "12345",
                    email: "pepe@pepe.com"
                }, {
                    name: "luis",
                    phone: "67890",
                    email: "luis@pepe.com"
                }], done);
            });
        });
    });
    
    describe('#allContacts()', function() {
        it('should return all contacts', function(done) {
            contacts.allContacts((err, res) => {
                if (err) {
                    return done(err);
                }
                
                expect(res).to.have.lengthOf(2);
                expect(res).to.contain.an.item.with.property('name', 'pepe');
                expect(res).to.contain.an.item.with.property('name', 'luis');
                done();
            });
        });
    });
    
    describe('#remove()', function() {
        it('should remove the element', function(done) {
            contacts.remove('pepe', (err) => {
                if (err) {
                    return done(err);
                }
                
                contacts.allContacts((err,res) => {
                    if (err) {
                        return done(err);
                    }
                    
                    expect(res).to.have.lengthOf(1);
                    expect(res).not.to.contain.an.item.with.property('name', 'pepe');
                    done();
                });
            });
        });
    });
});