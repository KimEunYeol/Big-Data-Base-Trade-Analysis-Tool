//var fs = require('fs');
//var latlng = JSON.parse(fs.readFileSync('../data/cityObj.json'));
var latlng = require('../data/cityObj');

//console.log(latlng);

var R = require('r-script');

var res = R('./twitter11.R')
  .data({ category: [ 'pc방', '오락', '당구', '볼링' ], lat: '37.517236', lng: '127.047325' })
//  .data({category: ["통닭","치킨","호식이","노랑통닭","bhc"], lat: latlng['서울특별시']['강남구'].latitude, lng: latlng['서울특별시']['강남구'].longitude})
  .callSync();

console.log(res);
