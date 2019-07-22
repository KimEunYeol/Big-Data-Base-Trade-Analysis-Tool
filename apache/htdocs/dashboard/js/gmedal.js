var url = 'http://gmedal.xyz:3002';

var captchaVerify = false;

var captchaCallback = function() {
  captchaVerify = true;
};

$(function() {
  $("#join").click(function() {
    location.href = 'join.html';
    return false;
  });
  $("#login").click(function() {
    if(captchaVerify) {
      var formData = {
        username: $("#username").val(),
        password: $("#password").val(),
      };
      $.ajax({
        type: 'POST',
        url: url + '/user',
        data: formData,
        dataType: 'json',
        success: function(response) {
          if(response.response == 'ok') {
            sessionStorage.SessionName = 'user';
            sessionStorage.setItem("user_id", response.id);
            sessionStorage.setItem('user_twitter', response.twitter);
            location.href = 'index.html';
          } else {
            alert('에러가 발생했습니다.');
          }
        },
        error: function(error) {
          if(error.status)
            alert('아이디와 비밀번호를 확인해주세요.');
          else
            alert('로그인 서버와의 연결에 문제가 발생했습니다.');
        }
      });
    } else {
      alert('로봇이 아닌 것을 인증해주세요.');
    }
    return false;
  });

  $("#joinReq").click(function() {
    if(!$("#username").val() || !$("#password").val() || !$("#password_check").val())
      alert('입력되지 않은 항목이 있습니다.');
    else if($('#password').val() != $('#password_check').val())
      alert('비밀번호가 일치하지 않습니다.');
    else if(captchaVerify) {
      var formData = {
        username: $("#username").val(),
        password: $("#password").val(),
        isAjax: 1
      };
      $.ajax({
        type: 'POST',
        url: url + '/newuser',
        data: formData,
        dataType: 'json',
        success: function(response) {
          if(response.response == 'ok') {
            alert('로그인 후 이용하실 수 있습니다.');
            location.href = 'index.html';
          } else {
            alert('에러가 발생했습니다.');
          }
        },
        error: function(error) {
          if(error.responseJSON.response == 'already')
            alert('이미 존재하는 아이디입니다.');
          else
            alert('서버와의 연결에 문제가 발생했습니다.');
        }
      });
    } else if(!captchaVerify) {
      alert('로봇이 아닌 것을 인증해주세요.');
    }
    return false;
  });

  $("#logout").click(function() {
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_twitter');
    location.href = 'login.html';
    return false;
  });

  $('#interestSubmit').click(function() {
    var formData = {
      id: sessionStorage.getItem('user_id'),
      wide: $('#intWide').val(),
      city: $('#intCity').val(),
      longitude: cityObj[$('#intWide').val()][$('#intCity').val()].longitude,
      latitude: cityObj[$('#intWide').val()][$('#intCity').val()].latitude,
      twitter: $('#intTwt').val(),
      category: $('#intCategory2').val(),
    };
    $.ajax({
      type: 'POST',
      url: url + '/moduser',
      data: formData,
      dataType: 'json',
      success: function(response) {
        if(response.response == 'ok') {
          sessionStorage.setItem('user_twitter', formData.twitter);
          alert('정보가 수정되었습니다.');
          location.href = 'index.html';
        } else {
          alert('에러가 발생했습니다.');
        }
      },
      error: function(error) {
        alert('서버와의 연결에 문제가 발생했습니다.');
      }
    });
    return false;
  });

  $("#intWide").change(function() {
    $('#intCity').find('option').remove();
    cityObj[$(this).val()].index.forEach(function(item) {
      $('#intCity').append('<option value="' + item + '">' + item + '</option>');
    });
    switch($('#intWide').val()) {
      case '서울특별시':
        $('#intTwt').val('서울').attr('selected', 'selected');
        break;
      case '부산광역시':
        $('#intTwt').val('부산').attr('selected', 'selected');
        break;
      case '인천광역시':
        $('#intTwt').val('인천').attr('selected', 'selected');
        break;
      case '광주광역시':
        $('#intTwt').val('광주').attr('selected', 'selected');
        break;
      case '대구광역시':
        $('#intTwt').val('대구').attr('selected', 'selected');
        break;
      case '대전광역시':
        $('#intTwt').val('대전').attr('selected', 'selected');
        break;
      case '울산광역시':
        $('#intTwt').val('울산').attr('selected', 'selected');
        break;
      case '세종특별자치시':
        $('#intTwt').val('대전').attr('selected', 'selected');
        break;
    };
    
  });

  $('#intCity').change(function() {
    switch($('#intCity').val()) {
      case '고양시':
        $('#intTwt').val('고양').attr('selected', 'selected');
        break;
      case '부천시':
        $('#intTwt').val('부천').attr('selected', 'selected');
        break;
      case '성남시':
        $('#intTwt').val('성남').attr('selected', 'selected');
        break;
      case '수원시':
        $('#intTwt').val('수원').attr('selected', 'selected');
        break;
      case '안산시':
        $('#intTwt').val('안산').attr('selected', 'selected');
        break;
      case '용인시':
        $('#intTwt').val('용인').attr('selected', 'selected');
        break;
      case '창원시':
        $('#intTwt').val('창원').attr('selected', 'selected');
        break;
    }
  });

  $('#intCategory1').change(function() {
    $('#intCategory2').find('option').remove();
    categoryObj[$(this).val()].forEach(function(item) {
      $('#intCategory2').append('<option value="' + item + '">' + item + '</option>');
    });
  });
});
