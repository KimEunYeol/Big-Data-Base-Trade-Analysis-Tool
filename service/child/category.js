require('./common.js');
const fs = require('fs');
const csv = require('csv-parser');

process.on('message', function(req) {
  var resObj = new Object();

  resObj.datasets = new Array();
  resObj.datasets[0] = new Object();
  resObj.datasets[0].data = new Array();
  resObj.datasets[0].backgroundColor = new Array();

  resObj.labels = new Array();

  fs.createReadStream(__dirname + '/../data/' + decodeURIComponent(req.wide) + '/' + decodeURIComponent(req.city) + '.csv')
    .on('error', function(error) {
      process.send('error');
      throw error;
    })
    .pipe(csv())
    .on('data', function(data) {
      if(data.상권업종중분류명 == decodeURIComponent(req.category)) {
        var offset = resObj.labels.indexOf(data['상권업종소분류명']);
        if(offset == -1) {
          resObj.labels.push(data['상권업종소분류명']);
          resObj.datasets[0].data.push(1);
          resObj.datasets[0].backgroundColor.push(randomColor());
        } else {
          resObj.datasets[0].data[offset]++;
        }
      }
    })
    .on('end', function() {
      process.send(resObj);
    });
});
