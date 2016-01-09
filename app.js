var express = require('express'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
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

app.get('/', function(req, res, next) {
  res.render('fruitPicker', { fruits: ['apple', 'banana', 'orange', 'peach'] });
});

app.post('/', function(req, res, next) {
  var fruit = req.body.fruit;
  if (typeof fruit === 'undefined') {
    next(Error('Please choose a fruit!'));
  } else {
    res.status(200).send('Your favorite fruit is ' + fruit);
  }
});

app.use(errorHandler);

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Express server listening on port %s', port);
});

