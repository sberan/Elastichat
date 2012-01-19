
var Channel = Backbone.Model.extend({
  
});

var Channels = Backbone.Collection.extend({
  model: Channel,
  url: "/channels"
});

var ChannelPicker = Backbone.View.extend({



});

$(function() {
  var channels = new Channels;
  channels.fetch({
    success: function() {
      console.log(channels.length);
    }
  });
});
