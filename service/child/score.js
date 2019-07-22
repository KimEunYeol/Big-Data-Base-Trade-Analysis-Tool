process.on('message', function(req){
  var cityArr = ['강원도', '경기도', '경상남도', '경상북도', '광주광역시', '대구광역시', '대전광역시', '부산광역시', '서울특별시', '세종특별자치시', '전라남도', '전라북도', '제주도', '충청남도', '충청북도'];
  var data = require('../data/score');
  var stable = require('../data/stable');
  var arr = new Array();

  arr.push({'score': data[cityArr.indexOf(req.wide)][req.wide][req.city]['지역경쟁력'][0]});
  arr.push({'score': data[cityArr.indexOf(req.wide)][req.wide][req.city]['업종경쟁력'][req.category][0]});
  arr.push({'score': stable[cityArr.indexOf(req.wide)][req.wide][req.city][req.category][0]});

  process.send(arr);
});
/*
var R = require('r-script');

process.on('message', function(req) {
  var res = R(__dirname + '/score.R')
    .data({wide: req.wide, city: req.city, category: req.category, date: req.date})
    .callSync();

  var arr = new Array();
  for(var i=0; i<2; i++) {
    arr[i] = new Object();
    arr[i].score = parseFloat(res[i].score).toFixed(1);
  }

  process.send(arr);
});
*/
