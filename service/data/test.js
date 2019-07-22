var data = require("./score");
console.log(data.length);
/*
var fs = require('fs');
//console.log(data);

var arr = new Array();

for(var i=0; i<data.length; i++)
  arr.push(data[i]);

var temp = arr.splice(0, 1);
arr.splice(3, 0, temp[0]);

fs.writeFile('score', JSON.stringify(arr, 0, 4), 'utf8', function(err) {
  if(err) throw err;
  console.log('done');
});
*/

//console.log(arr);
//console.log(temp);
//console.log(JSON.stringify(arr));
/*
var cityArr = ["강원도", "경기도", "경상남도", "경상북도", "광주광역시", "대구광역시", "대전광역시", "부산광역시", "서울특별시", "세종특별자치시", "전라남도", "전라북도", "제주도", "충청남도", "충청북도"];
var req = {"wide": "서울특별시", "city": "강남구", "category": "PC/오락/당구/볼링등"};

console.log(data[cityArr.indexOf(req.wide)][req.wide][req.city]["지역경쟁력"][0]);
*/
