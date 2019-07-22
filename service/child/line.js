require('./common.js');

const fs = require('fs');
const async = require('async');
const csv = require('csv-parser');

process.on('message', function(req) {
  var resObj = new Object(); // result resObj.wideect

  resObj.labels = new Array();
  resObj.datasets = new Array();
  resObj.datasets[0] = new Object();
  resObj.datasets[0].data = new Array();

  var o = Math.round, r = Math.random, s = 255;

  var r1 = o(r()*s);
  var r2 = o(r()*s);
  var r3 = o(r()*s);

  resObj.datasets[0].label = decodeURIComponent(req.category);
//  resObj.datasets[0].borderColor = 'rgb(75, 192, 192)';
//  resObj.datasets[0].borderColor = 'rgb(r1, r2, r3)';
  resObj.datasets[0].lineTension = 0.1;
//  resObj.datasets[0].backgroundColor = randomColor();
//  resObj.datasets[0].backgroundColor = 'rgba(255,153,0,0.4)';
//  resObj.datasets[0].backgroundColor = 'rgba(75, 192, 192, 0.4)';
//  resObj.datasets[0].backgroundColor = 'rgba(r1, r2, r3, 0.4)';
  resObj.datasets[0].backgroundColor = 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';

  var index = -1;

  fs.readdir(__dirname + '/../data/' + decodeURIComponent(req.wide), function(err, files) {
    async.eachSeries(files, function(file, callback) {

      resObj.labels.push(file);
      index++;

      fs.readdir(__dirname + '/../data/' + decodeURIComponent(req.wide) + '/' + file, function(e, ff) {
        if(e) {
          process.send('error');
          throw e;
        }

        resObj.datasets[0].data.push(0);

        async.map(
          ff, 
          function(item, cb) {
            if(item == decodeURIComponent(req.city) + '.csv') {
              fs.createReadStream('./data/' + decodeURIComponent(req.wide) + '/' + file + '/' + item)
                .on('error', function(error) {
                  process.send('error');
                  throw error;
                })
                .pipe(csv())
                .on('data', function(data) {
                  if(data['상권업종중분류명'] == decodeURIComponent(req.category)) {
                    resObj.datasets[0].data[index]++;
                  }
                })
                .on('end', function() {
                   cb();
                })
            } else {
              cb();
            }
          }, function(error) {
            if(error) {
              process.send('error');
              throw error;
            }
            callback();
          });
      });
    }, function(error) {
      if(error) {
        process.send('error');
        throw error;
      }
      process.send(resObj);
    });
  });
});
