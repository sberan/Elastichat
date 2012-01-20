var Stubble = require('stubble'),
    events = require('events'),
    assert = require('assert'),
    _ = require('underscore');

var ircClient = new events.EventEmitter();
ircClient.join = function(channel){
  ircClient.emit("join", channel);
}

var irc = {
  Client: function(){
    return ircClient;
  }
}

var docs = [];
var execs = 0
var es = function() {
  this.index = function(index, type, doc){docs.push(doc); return this; }
  this.exec = function(){execs++;}
}

var stub = new Stubble({irc: irc, elasticsearchclient: es});

var Elastichat = stub.require(__dirname + "/../lib/elastichat.js"),
    chat = new Elastichat({
      irc: {
        nick: "sam_b",
        server: "irc.freenode.net",
        channels: ["##javascript", "#Node.js"] 
      },
      search: {
        index: "irc",
        host: "localhost",
        port: 9200
      }
    });

ircClient.emit("registered");
ircClient.emit("join", "#foo");
ircClient.emit("message","s_b", "#foo", "yo!");

setTimeout(function(){
  assert(true);
  var channel = docs.shift();
  assert.equal(channel.id, "##javascript");
  channel = docs.shift();
  assert.equal(channel.channel, "#foo");
  var message = docs.shift();
  assert.equal(message.sender, "s_b");
  assert.equal(message.channel, "#foo");
  assert.equal(message.message, "yo!");

}, 1000);
