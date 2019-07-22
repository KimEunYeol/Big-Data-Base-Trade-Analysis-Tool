const fs = require('fs');
const csv = require('csv-parser');

process.on('message', function(req) {
  var object = new Object();

  object.features = new Array();

  fs.createReadStream(__dirname + '/../data/' + decodeURIComponent(req.wide) + '/2017.03/' + decodeURIComponent(req.city) + '.csv')
    .on('error', function(error) {
      process.send('error');
      throw error;
    })
    .pipe(csv())
    .on('data', function(data) {
      if(data.상권업종중분류명 == decodeURIComponent(req.category)) {
        var jsonObject = new Object();
        jsonObject.category1 = data['상권업종소분류명'];
        jsonObject.category2 = data['표준산업분류명'];
        jsonObject.label = data['상호명'];
        jsonObject.address1 = data['지번주소'];
        jsonObject.address2 = data['도로명주소'];
        jsonObject.geometry = new Object();
        jsonObject.geometry.coordinates = [parseFloat(data.경도), parseFloat(data.위도)];

        object.features.push(jsonObject);
      }
    })
    .on('end', function() {
      process.send('return_data(' + JSON.stringify(object) + ');');
    });
});
