var Stubble = require('stubble');
var events = require('events');

var ircClient = new events.EventEmitter();
ircClient.join = function(channel){
  ircClient.emit("join", channel);
}

var irc = {
  Client: function(){
    return ircClient;
  }
}

var es = function() {
  this.index = function(){ return this }
  this.exec = function(){}
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

setTimeout(function(){

}, 1000);
