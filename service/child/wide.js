require('./common.js');
const fs = require('fs');
const async = require('async');
const csv = require('csv-parser');

process.on('message', function(req) {
  var resObj = new Object();

  resObj.datasets = new Array();
  resObj.datasets[0] = new Object();
  resObj.datasets[0].data = new Array();
  resObj.datasets[0].backgroundColor = new Array();

  resObj.labels = new Array();

  fs.readdir(__dirname + '/../data/' + decodeURIComponent(req.wide), function(err, files) {
    async.eachSeries(files, function(file, callback) {
      resObj.labels.push(file.split('.csv')[0]);
      resObj.datasets[0].data.push(0);
      resObj.datasets[0].backgroundColor.push(randomColor());

      fs.createReadStream('./data/' + decodeURIComponent(req.wide) + '/' + file)
        .on('error', function(error) {
          process.send('error');
          throw error;
        })
        .pipe(csv())
        .on('data', function(data) {
          if(data.상권업종중분류명 == decodeURIComponent(req.category)) {
            resObj.datasets[0].data[resObj.labels.length-1]++;
          }
        })
        .on('end', function() {
          callback();
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
