const config = require('config');
const Twitter = require('twitter');
const twitter = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

const area = {
  '고양': 1130853,
  '광주': 1132466,
  '대구': 1132466,
  '대전': 2345975,
  '부산': 1132447,
  '부천': 1132445,
  '서울': 1132599,
  '성남': 1132559,
  '수원': 1132567,
  '안산': 1132444,
  '용인': 1132094,
  '울산': 1132578,
  '인천': 1132496,
  '창원': 1132449
};

process.on('message', function(req) {
  twitter.get('trends/place.json', {id: area[decodeURIComponent(req.twitter)]}, function(error, tweets, response) {
    if(error) {
      process.send('error');
console.log(error);
      throw error;
    } else
      process.send(tweets);
  });

});
