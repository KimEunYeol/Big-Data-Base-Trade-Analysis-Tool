require('./common.js');

const fs = require('fs');
const async = require('async');
const csv = require('csv-parser');

const colors = ['#F7464A', '#46BFBD', '#FDB45C', '#AF8FE8', '#FF59B6', '#949FB1'];

process.on('message', function(req) {
  var resObj = new Object(); // result resObj.wideect

  resObj.wide = new Object();
  resObj.city = new Object();
  resObj.category = new Object();

  resObj.wide.datasets = new Array();
  resObj.wide.datasets[0] = new Object();
  resObj.wide.datasets[0].data = new Array();
  resObj.wide.datasets[0].backgroundColor = new Array();
  resObj.wide.labels = new Array();

  resObj.city.datasets = new Array();
  resObj.city.datasets[0] = new Object();
  resObj.city.datasets[0].data = new Array();
  resObj.city.datasets[0].backgroundColor = new Array();
  resObj.city.labels = new Array();

  resObj.category.datasets = new Array();
  resObj.category.datasets[0] = new Object();
  resObj.category.datasets[0].data = new Array();
  resObj.category.datasets[0].backgroundColor = new Array();
  resObj.category.labels = new Array();

  var wideArr = new Array();
  var cityArr = new Array();
  var categoryArr = new Array();

  fs.readdir(__dirname + '/../data/' + decodeURIComponent(req.wide) + '/2017.03/', function(err, files) {
    async.eachSeries(files, function(file, callback) {
      wideArr.push({'label': file.split('.csv')[0], 'data': 1});

/*
      resObj.wide.labels.push(file.split('.csv')[0]);
      resObj.wide.datasets[0].data.push(0);
      resObj.wide.datasets[0].backgroundColor.push(randomColor());
*/

      fs.createReadStream('./data/' + decodeURIComponent(req.wide) + '/2017.03/' + file)
        .on('error', function(error) {
          process.send('error');
          throw error;
        })
        .pipe(csv())
        .on('data', function(data) {
          if(data.상권업종중분류명 == decodeURIComponent(req.category)) {
            wideArr[wideArr.length-1].data++;

/*
            resObj.wide.datasets[0].data[resObj.wide.labels.length-1]++;
*/

            if(file == decodeURIComponent(req.city) + '.csv') {
              var dupCheck = false;
              cityArr.find(function(elem) {
                if(elem.label == data['법정동명']) {
                  elem.data++;
                  dupCheck = true;
                  return true;
                }
              });
              if(!dupCheck)
                cityArr.push({'label': data['법정동명'], 'data': 1});
/*
              var cityOffset = resObj.city.labels.indexOf(data['법정동명']);
              if(cityOffset == -1) {
                resObj.city.labels.push(data['법정동명']);
                resObj.city.datasets[0].data.push(1);
                resObj.city.datasets[0].backgroundColor.push(randomColor());
              } else {
                resObj.city.datasets[0].data[cityOffset]++;
              }
*/

              var dupCheck2 = false;
              categoryArr.find(function(elem) {
                if(elem.label == data['상권업종소분류명']) {
                  elem.data++;
                  dupCheck2 = true;
                  return true;
                }
              });
              if(!dupCheck2)
                categoryArr.push({'label': data['상권업종소분류명'], 'data': 1});
/*
              var categoryOffset = resObj.category.labels.indexOf(data['상권업종소분류명']);
              if(categoryOffset == -1) {
                resObj.category.labels.push(data['상권업종소분류명']);
                resObj.category.datasets[0].data.push(1);;
                resObj.category.datasets[0].backgroundColor.push(randomColor());
              } else {
                resObj.category.datasets[0].data[categoryOffset]++;
              }
*/
            }
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

      var elseItem = 0;
      var elseCityItem = 0;
      var elseCategoryItem = 0;
      wideArr.sort(function(a, b) {
        return((a.data > b.data) ? -1 : ((a.data == b.data) ? 0 : 1));
      });
      wideArr.forEach(function(item, index) {
        if(index < 5) {
          resObj.wide.labels.push(item.label);
          resObj.wide.datasets[0].data.push(item.data);
          resObj.wide.datasets[0].backgroundColor.push(colors[index]);
//          resObj.wide.datasets[0].backgroundColor.push(randomColor());
        } else
          elseItem += item.data;
      });
      if(elseItem > 0) {
        resObj.wide.labels.push('기타');
        resObj.wide.datasets[0].data.push(elseItem);
        resObj.wide.datasets[0].backgroundColor.push(colors[5]);
//      resObj.wide.datasets[0].backgroundColor.push(randomColor());
      }

      cityArr.sort(function(a, b) {
        return((a.data > b.data) ? -1 : ((a.data == b.data) ? 0 : 1));
      });
      cityArr.forEach(function(item, index) {
	if(index < 5) {
	  resObj.city.labels.push(item.label);
	  resObj.city.datasets[0].data.push(item.data);
	  resObj.city.datasets[0].backgroundColor.push(colors[index]);
	} else
	  elseCityItem += item.data;
      });
      if(elseCityItem > 0) {
        resObj.city.labels.push('기타');
        resObj.city.datasets[0].data.push(elseCityItem);
        resObj.city.datasets[0].backgroundColor.push(colors[5]);
      }

      categoryArr.sort(function(a, b) {
        return((a.data > b.data) ? -1 : ((a.data == b.data) ? 0 : 1));
      });
      categoryArr.forEach(function(item, index) {
	if(index < 5) {
	  resObj.category.labels.push(item.label);
	  resObj.category.datasets[0].data.push(item.data);
	  resObj.category.datasets[0].backgroundColor.push(colors[index]);
	} else
	  elseCategoryItem += item.data;
      });
      if(elseCategoryItem > 0) {
        resObj.category.labels.push('기타');
        resObj.category.datasets[0].data.push(elseCategoryItem);
        resObj.category.datasets[0].backgroundColor.push(colors[5]);
      }

      process.send(resObj);
    });
  });
});
