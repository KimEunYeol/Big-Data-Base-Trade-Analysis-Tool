$(function() {
  $.ajax({
    url: 'http://www.smba.go.kr/site/smba/supportPolicy/supportPolicyList.do?target=3',
    success: function(data) {
      console.log(data);
    }
  });
});
