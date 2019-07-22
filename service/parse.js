const mysql = require('mysql');
const fs = require('fs');
const csv = require('csv-parser');
const async = require('async');
//var connection = require('./connection.js');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'apekf',
  database: 'gmedal'
});

var index = 0;

var array = new Array();

fs.createReadStream(__dirname + '/data/경기도/2015.12/수원시.csv')
  .on('error', function(error) {
    throw error;
  })
  .pipe(csv())
  .on('data', function(data) {
    if(index != 0) {
    array.push([data['상가업소번호'],data['상호명'],data['지점명'],data['상권업종대분류코드'],data['상권업종대분류명'],data['상권업종중분류코드'],data['상권업종중분류명'],data['상권업종소분류코드'],data['상권업종소분류명'],data['표준산업분류코드'],data['표준산업분류명'],data['시도코드'],data['시도명'],data['시군구코드'],data['시군구명'],data['행정동코드'],data['행정동명'],data['법정동코드'],data['법정동명'],data['지번코드'],data['대지구분코드'],data['대지구분명'],data['지번본번지'],data['지번부번지'],data['지번주소'],data['도로명코드'],data['도로명'],data['건물본번지'],data['건물부번지'],data['건물관리번호'],data['건물명'],data['도로명주소'],data['구우편번호'],data['신우편번호'],data['동정보'],data['층정보'],data['호정보'],data['경도'],data['위도']]);
}
    console.log('array ...', index++);

/*
    var sql = {
    '상가업소번호': data['상가업소번호'],
    '상호명': data['상호명'],
    '지점명': data['지점명'],
    '상권업종대분류코드': data['상권업종대분류코드'],
    '상권업종대분류명': data['상권업종대분류명'],
    '상권업종중분류코드': data['상권업종중분류코드'],
    '상권업종중분류명': data['상권업종중분류명'],
    '상권업종소분류코드': data['상권업종소분류코드'],
    '상권업종소분류명': data['상권업종소분류명'],
    '표준산업분류코드': data['표준산업분류코드'],
    '표준산업분류명': data['표준산업분류명'],
    '시도코드': data['시도코드'],
    '시도명': data['시도명'],
    '시군구코드': data['시군구코드'],
    '시군구명': data['시군구명'],
    '행정동코드': data['행정동코드'],
    '행정동명': data['행정동명'],
    '법정동코드': data['법정동코드'],
    '법정동명': data['법정동명'],
    '지번코드': data['지번코드'],
    '대지구분코드': data['대지구분코드'],
    '대지구분명': data['대지구분명'],
    '지번본번지': data['지번본번지'],
    '지번부번지': data['지번부번지'],
    '지번주소': data['지번주소'],
    '도로명코드': data['도로명코드'],
    '도로명': data['도로명'],
    '건물본번지': data['건물본번지'],
    '건물부번지': data['건물부번지'],
    '건물관리번호': data['건물관리번호'],
    '건물명': data['건물명'],
    '도로명주소': data['도로명주소'],
    '구우편번호': data['구우편번호'],
    '신우편번호': data['신우편번호'],
    '동정보': data['동정보'],
    '층정보': data['층정보'],
    '호정보': data['호정보'],
    '경도': data['경도'],
    '위도': data['위도']
    };
console.log(index);
    connection.query('INSERT INTO 201706 VALUE ?', sql, function(error, result) {
      if(error)
        throw error;
      console.log('insert ... ', index++);
    });
*/
  })
  .on('end', function() {
    console.log('array ... complete');
    connection.connect(function(err) {
      if(err)
        throw err;
      console.log('connect ... complete');
//      connection.query('INSERT INTO data(날짜, 상가업소번호, 상호명, 지점명, 상권업종대분류코드, 상권업종대분류명, 상권업종중분류코드, 상권업종중분류명, 상권업종소분류코드, 상권업종소분류명, 표준산업분류코드, 표준산업분류명, 시도코드, 시도명, 시군구코드, 시군구명, 행정동코드, 행정동명, 법정동코드, 법정동명, 지번코드, 대지구분코드, 대지구분명, 지번본번지, 지번부번지, 지번주소, 도로명코드, 도로명, 건물본번지, 건물부번지, 건물관리번호, 건물명, 도로명주소, 구우편번호, 신우편번호, 동정보, 층정보",호정보,경도,위도) VALUES ?', [array], function(error, result) {
      index = 0;
      async.eachSeries(
        array,
        function(item, callback) {
          connection.query('INSERT INTO data VALUE ?', item, function(error) {
            if(error)
              throw error;
            console.log('insert ... ', index++);
            callback();
          });
        },
        function(error) {
          if(error)
            throw error;
          console.log('async ... complete');
        }
      );
/*
      connection.query('INSERT INTO data VALUE ?', array[1], function(error, result) {
        if(error)
          throw error;
        console.log('insert ... ', index++);
      });
*/
    });
  });
