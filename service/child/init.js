var fs = require('fs');
var csv = require('csv-parser');

var wideArr = new Array();

var wides = fs.readdirSync(__dirname + '/../data');

wides.find(function(val, index) {
  if(fs.lstatSync(__dirname + '/../data/' + val).isDirectory()) {
    wides = wides.slice(index, wides.length);
    return true;
  } else
    return false;
});

wides.forEach(function(wide) {
  var obj = {
    'wide': wide,
    'dateArr': [
    ]
  };
  wideArr.push(obj);

  var dates = fs.readdirSync(__dirname + '/../data/' + wide);
  dates.forEach(function(date) {
    var obj = {'date': date, cityArr: []};
    wideArr[wides.indexOf(wide)].dateArr.push(obj);

    var cities = fs.readdirSync(__dirname + '/../data/' + wide + '/' + date);
    cities.forEach(function(city) {
      var obj = {};

      fs.createReadStream(__dirname + '/../data/' + wide + '/' + date + '/' + city)
        .on('error', function(error) { hError(error); })
        .pipe(csv())
        .on('data', function(data) {
          console.log(data);
        })
        .on('end', function() {
        });
    });
  });

});

/*
fs.readdirSync(__dirname + '/../data/', function(error, dirs) {
  if(error) hError(error);

  dirs.forEach(function(dir) {
    if(!fs.lstatSync(__dirname + '/../data/' + dir).isDirectory()) return false;

    arr.push(dir);
    var obj = {
      'wide': dir,
      'dateArr': [
      ]
    };
    wideArr.push(obj);
  });
});

  for(var i=0; i<arr.length; i++) {
    fs.readdir(__dirname + '/../data/' + arr[i], function(error, dirs) {
      if(error) hError(error);

      for(var i=0; i<dirs.length; i++) {
        var o = {'date': dirs[i], cityArr: []};
        wideArr[arr.indexOf(dir)].dateArr.push(o);
      }
    });
  }
  console.log(JSON.stringify(wideArr, 0, 4));

var hError = function(error) {
  throw error;
};
*/
