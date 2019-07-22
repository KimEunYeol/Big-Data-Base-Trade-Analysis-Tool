/* config (./config/default.json) */
const config = require('config');

/* express & middleware */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

/* socket.io */
const http = require('http').Server(app);
const io = require('socket.io')(http);

/* r-script */
const R = require('r-script');

io.on('connection', function(socket) {
  console.log('connection', socket.handshake.address);
  socket.on('chat', function(msg) {
    console.log(msg);
    io.emit('chat', msg);
  });
});

/* child process */
const cp = require('child_process');

/* mysql */
const mysql = require('mysql');

// mysql connect
var connection = mysql.createConnection({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});
connection.connect();

// express setting
app.set('PORT', process.env.PORT || 3002);
/*
app.listen(app.get('PORT'), function(error) {
  if(error) throw error;
  console.log('express listening on port', app.get('PORT'));
});
*/
http.listen(app.get('PORT'), function(error) {
  if(error) throw error;
  console.log('http listening on port', app.get('PORT'));
});
app.use(function(req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Max-Age': '1000'
  });
  next();
});

// express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// REST api
app.post('/newuser', function(req, res) {
  console.log('POST', '/newuser', req.body.username, req.body.password);
//  connection.query('INSERT INTO users(id, username, password) VALUES(NULL, "' + req.body.username + '", "' + req.body.password + '")', function(error, results, fields) {
  var acct = {username: req.body.username, password: req.body.password};
  connection.query('SELECT * FROM users where username="' + req.body.username + '"', function(error, rows) {
    if(error) {
      res.status(500).json({"response": "error"});
      throw error;
    }
    if(rows.length == 0) {
      connection.query('INSERT INTO users SET ?', acct, function(err, results, fields) {
        if(err) {
          res.status(500).json({'response': 'error'});
          throw error;
        }
        res.status(200).json({'response': 'ok'});
      });
    } else {
        res.status(401).json({'response': 'already'});
    }
  });
});

app.post('/user', function(req, res) {
  console.log('POST', '/user', req.body.username, req.body.password);
  connection.query('SELECT * FROM users WHERE username="' + req.body.username + '" AND password="' + req.body.password + '"', function(error, rows) {
    if(error) {
      res.status(500).json({"response": "error"});
      throw error;
    }
    if(rows.length == 1) {
      connection.query('SELECT * FROM interest WHERE id=' + rows[0].id, function(err, r) {
        if(error) {
          res.status(500).json({"response": "error"});
          throw error;
        }
        if(r.length == 1)
          res.status(200).json({"response": "ok", "id": rows[0].id, "username": rows[0].username, "twitter": r[0].twitter});
        else
          res.status(200).json({"response": "ok", "id": rows[0].id, "username": rows[0].username});
      });
    }
    else
      res.status(401).json({"response": "error"});
  });
});

app.get('/user/:id', function(req, res) {
  console.log('GET', '/user/' + req.params.id);
  connection.query('SELECT * FROM interest WHERE id="' + req.params.id + '"', function(error, rows) {
    if(rows.length == 1) {
//      res.status(200).json({response: 'ok', data: rows});
      connection.query('SELECT username FROM users WHERE id="' + req.params.id +'"', function(error, r) {
        if(error) throw error;
        if(r.length == 1) {
          var obj = Object.assign({}, r[0], rows[0]);
          res.status(200).json({response: 'ok', data: obj});
        }
      });
    } else
      res.status(401).json({response: 'error'});
  });
});

/*
app.post('/user/:id', function(req, res) {
  console.log('POST', '/user/' + req.body.id);
});
*/

app.post('/moduser', function(req, res) {
  console.log('POST', '/moduser', req.body.id, req.body.wide, req.body.city, req.body.twitter, req.body.category);
  
  var interest = {id: req.body.id, wide: req.body.wide, city: req.body.city, longitude: req.body.longitude, latitude: req.body.latitude, twitter: req.body.twitter, category: req.body.category};
//  connection.query('INSERT INTO interest SET ? ON DUPLICATE KEY UPDATE id="' + req.body.id + '"', interest, function(err, results, fields) {
  connection.query('REPLACE INTO interest SET ?', interest, function(err, results, fields) {
    if(err) {
      res.status(500).json({'response': 'error'});
      throw err;
    }
    res.status(200).json({'response': 'ok'});
  });

});

app.get('/csv', function(req, res) {
  console.log('GET', '/csv', req.query.wide, req.query.city, req.query.category);

  var child = cp.fork(__dirname + '/child/csv.js');

  child.send({wide: req.query.wide, city: req.query.city, category: req.query.category});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else {
      res.status(200).write(message);
      res.end();
    }
    child.kill();
  });
});

app.get('/score', function(req, res) {
  console.log('GET', '/score', req.query.wide, req.query.city, req.query.category);

  var child = cp.fork(__dirname + '/child/score.js');

  child.send({wide: req.query.wide, city: req.query.city, category: req.query.category, date: '2017.03'});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else 
      res.status(200).json(message);
    child.kill();
  });
});

app.get('/score_text', function(req, res) {
  console.log('GET', '/score_text', req.query.wide, req.query.city, req.query.category);

  var catJson = require('./data/score_text');

  var child = cp.fork(__dirname + '/child/score_text.js');

  child.send({wide: req.query.wide, city: req.query.city, category: catJson[req.query.category]});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else
      res.status(200).json(message);
    child.kill();
  });
});

app.get('/line', function(req, res) {
  console.log('GET', '/line', req.query.wide, req.query.city, req.query.category);

  var child = cp.fork(__dirname + '/child/line.js');

  child.send({wide: req.query.wide, city: req.query.city, category: req.query.category});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else
      res.status(200).json(message);
    child.kill();
  });
});

app.get('/pie', function(req, res) {
  console.log('GET', '/pie', req.query.wide, req.query.city, req.query.category);

  var child = cp.fork(__dirname + '/child/pie.js');

  child.send({wide: req.query.wide, city: req.query.city, category: req.query.category});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else
      res.status(200).json(message);
    child.kill();
  });

});

app.get('/wide', function(req, res) {
  console.log('GET', '/wide', req.query.wide, req.query.category);

  var child = cp.fork(__dirname + '/child/wide.js');

  child.send({wide: req.query.wide, category: req.query.category});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else
      res.status(200).json(message);
    child.kill();
  });
});

app.get('/city', function(req, res) {
  console.log('GET', '/city', req.query.wide, req.query.city, req.query.category);

  var child = cp.fork(__dirname + '/child/city.js');

  child.send({wide: req.query.wide, city: req.query.city, category: req.query.category});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else
      res.status(200).json(message);
    child.kill();
  });
});

app.get('/category', function(req, res) {
  console.log('GET', '/category', req.query.wide, req.query.city, req.query.category);

  var child = cp.fork(__dirname + '/child/category.js');

  child.send({wide: req.query.wide, city: req.query.city, category: req.query.category});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else
      res.status(200).json(message);
    child.kill();
  });
});


app.get('/test', function(req, res) {
  console.log('GET', '/test');
  var object = new Object();
  object.type = "FeatureCollection";
  object.features = new Array();
  object.features.push({"type": "Feature", "geometry": {"type": "Point", coordinates: [127.0374017, 37.63470985]}});
  res.status(200).write('return_data(' + JSON.stringify(object) + ');');
  res.end();
});

app.get('/twitter', function(req, res) {
  console.log('GET', '/twitter', req.query.wide, req.query.city, req.query.category);

  var child = cp.fork(__dirname + '/child/twitter.js');

  child.send({wide: req.query.wide, city: req.query.city, category: req.query.category});
  child.on('message', function(message) {
    res.status(200).json(message);
    child.kill();
  });
});

/*
app.get('/keywords', function(req, res) {
  console.log('GET', '/keywords', req.query.twitter);

  var child = cp.fork(__dirname + '/child/keywords.js');

  child.send({twitter: req.query.twitter});
  child.on('message', function(message) {
    if(message == 'error')
      res.status(500).json({'response': 'error'});
    else
      res.status(200).json(message);
    child.kill();
  });
});
*/
