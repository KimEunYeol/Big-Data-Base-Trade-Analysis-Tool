var R = require('r-script')
var categ = require('../data/categ');
var latlng = require('../data/cityObj');

process.on('message', function(req) {
  var res = R(__dirname + '/twitter11.R')
    .data({category: categ[req.category], lat: latlng[req.wide][req.city].latitude.toString(), lng: latlng[req.wide][req.city].longitude.toString()})
    .callSync();

  var resObj = new Object();
  resObj.feeling = new Object();

  resObj.feeling.datasets = new Array();
  resObj.feeling.datasets[0] = new Object();
  resObj.feeling.labels = new Array();

  resObj.feeling.datasets[0].data = [res.feeling[0]['count'], res.feeling[2]['count'], res.feeling[1]['count']];
  resObj.feeling.datasets[0].backgroundColor = ['#F7464A', '#46BFBD', '#FDB45C'];
  resObj.feeling.labels = ['긍정', '부정', '중립'];

  resObj.words = new Object();
  var words = new Array();
  var count = 0;

  var limit = res.words.length;
  if(limit >= 50) limit = 50;

  for(var i=0; i<limit; i++) {
    count += res.words[i].count;
  }

  for(var i=0; i<limit; i++) {
    var arr = new Array();
    arr.push(res.words[i].word);
    arr.push(parseFloat((res.words[i].count / count).toFixed(2)));
    words.push(arr);
  }
  resObj.words = words;

  process.send(resObj);
});
