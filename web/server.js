var ElasticSearchClient = require('elasticsearchclient'),
  _ = require('underscore'),
  express = require('express');

var app = express.createServer();

app.use(express.static(__dirname + '/public'));

var es = new ElasticSearchClient({
  host: 'localhost',
  port: 9200
});

app.get('/channels', function(req, res) {
  es.search('irc', 'irc_channel').on('data', function(data){
    res.send(_(JSON.parse(data).hits.hits).pluck('_source'));
  }).exec();
});


app.listen(3000);
