var IrcClient = require('irc').Client;
var ElasticSearchClient = require('elasticsearchclient');

module.exports = Elastichat = function(opts) {

  var irc = new IrcClient(opts.irc.server, opts.irc.nick, {
    username: opts.irc.nick
  });

  var es = new ElasticSearchClient({
    host: opts.search.host,
    port: opts.search.port
  });

  function joinChannels(channels) {
    var channel = channels.shift();
    if(channel) {
      console.log("joining channel: " + channel);
      irc.join(channel);
      setTimeout(joinChannels, 500, channels);
    }
  }

  irc.on("registered", function(message) {
    console.log("connected");
    joinChannels(opts.irc.channels);
  });

  irc.on("message", function(sender, channel, message) {
    var doc = {
      sender: sender, 
      channel: channel,
      message: message,
      date: new Date()
    };
    es.index(opts.search.index, "irc_message", doc).exec();
  });

  irc.on("join", function(channel) {
    var doc = {
      id: channel,
      channel: channel
    };
    console.log("joined " + channel );
    es.index(opts.search.index, "irc_channel", doc).exec();
  });

  irc.on("error", function(message){
    console.log("error in irc: " + JSON.stringify(message));
  });
}


