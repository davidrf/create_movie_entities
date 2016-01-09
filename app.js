var express = require('express'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    app = express();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

function errorHandler(err, req, res, next) {
  console.error(err.message);
  console.error(err.stack);
  res.status(500);
  res.render('error_template', { error: err });
}

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  app.get('/', function(req, res, next) {
    res.redirect('/movies');
  });

  app.get('/movies', function(req, res, next) {
    db.collection('movies').find({}).toArray(function(err, docs) {
      res.render('movies', { 'movies': docs } );
    });
  });

  app.post('/movies', function(req, res, next) {
    var title = req.body.title,
        year = req.body.year,
        imdb = req.body.imdb;

    if (title === '' || year === '' || imdb === '') {
      next(Error('You must specify a title, year, and imdb'));
    } else {
      db.collection('movies').insertOne({title: title, year: year, imdb: imdb}, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        res.redirect('/movies');
      });
    }

  });

  app.use(errorHandler);

  var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
  });
});

