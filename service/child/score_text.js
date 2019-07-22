var R = require('r-script');
var latlng = require('../data/cityObj');

process.on('message', function(req) {
//  var jsonData = {'category': req.category};
console.log({category: req.category, lat: latlng[req.wide][req.city].latitude, lng: latlng[req.wide][req.city].longitude});
  var res = R(__dirname + '/score_text.R')
    .data({category: req.category, lat: latlng[req.wide][req.city].latitude, lng: latlng[req.wide][req.city].longitude})
    .callSync();

//  process.send(res);

  var resObj = new Object();

  resObj.datasets = new Array();
  resObj.datasets[0] = new Object();
  resObj.labels = new Array();

  resObj.datasets[0].data = [res[0]['빈도'], res[1]['빈도'], res[2]['빈도']];
  resObj.datasets[0].backgroundColor = ['#F7464A', '#46BFBD', '#FDB45C'];
  resObj.labels = ['긍정', '부정', '중립'];

  process.send(resObj);
});
