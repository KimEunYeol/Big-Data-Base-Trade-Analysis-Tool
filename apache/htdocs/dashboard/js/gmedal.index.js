var url = 'http://gmedal.xyz:3002'
var map;
var scriptSrc;
var lng, lat;
var markers = new Array();
var openInfowindow;
var userData;

$(function() {
  $.ajax({
    type: 'GET',
    url: url + '/user/' + sessionStorage.getItem("user_id"),
    dataType: 'json',
    success: function(response) {
      userData = response.data;
      $('#card-map-header').html('<i class="fa fa-map-marker"></i> ' + userData.wide + ' ' + userData.city + ' - ' + userData.category);
      lng = userData.longitude;
      lat = userData.latitude;
      scriptSrc = url + '/csv?wide=' + userData.wide + '&city=' + userData.city + '&category=' + userData.category;
      $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBwKz0B9gmFh21f9pcWXi9SStJeVxoBF0w&callback=initMap');
      $('#loading-map').hide();
      ajaxPie(userData);
      ajaxLine(userData);
      ajaxTwitter();

      $('<iframe />', {
        name: 'irc',
        id: 'irc',
        src: 'http://61.78.185.84:9000/?username=' + userData.username + '&city=' + encodeURIComponent(userData.wide + '_' + userData.city) + '&category=' + encodeURIComponent(userData.category) + '&join=' + encodeURIComponent('#' + userData.category) + ',' + encodeURIComponent('#' + userData.wide) + '_' + encodeURIComponent(userData.city),
        width: '100%',
        height: '350px',
        frameborder: 0
      }).appendTo($('#chat'));

    },
    error: function(error) {
      if(error.status) {
        alert('등록된 정보가 없습니다.');
        location.href = 'interest.html';
      } else
        alert('서버와의 연결에 문제가 발생했습니다.');
    }
  });
});

function drawLinechart(context, data) {
  var o = Math.round, r = Math.random, s = 255;

  var lineChart = new Chart(context, {
    type: 'line',
    data: data,
    options: {
      animation: {
        animateScale: true,
        animateRotate: true
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
    }
  });
};

function drawPiechart(context, data) {

  Chart.Tooltip.positioners.outer = function(elements) {
    if (!elements.length) {
        return false;
    }

    var i, len;
    var x = 0;
    var y = 0;

    for (i = 0, len = elements.length; i < len; ++i) {
        var el = elements[i];
        if (el && el.hasValue()) {
            var elPosX = el._view.x+0.95*el._view.outerRadius*Math.cos((el._view.endAngle-el._view.startAngle)/2+el._view.startAngle);
            var elPosY = el._view.y+0.95*el._view.outerRadius*Math.sin((el._view.endAngle-el._view.startAngle)/2+el._view.startAngle);
            if (x < elPosX) {
                x = elPosX;
            }
            if (y < elPosY) {
                y = elPosY;
            }
        }
    }

    return {
        x: Math.round(x),
        y: Math.round(y)
    };
},


Chart.pluginService.register({
  beforeRender: function(chart) {
    if (chart.config.options.showAllTooltips) {
      chart.pluginTooltips = [];
      chart.config.data.datasets.forEach(function(dataset, i) {
        chart.getDatasetMeta(i).data.forEach(function(sector, j) {
          chart.pluginTooltips.push(new Chart.Tooltip({
            _chart: chart.chart,
            _chartInstance: chart,
            _data: chart.data,
            _options: chart.options.tooltips,
            _active: [sector]
          }, chart));
        });
      });

      // turn off normal tooltips
      chart.options.tooltips.enabled = false;
    }
  },
  afterDraw: function(chart, easing) {
    if (chart.config.options.showAllTooltips) {
      if (!chart.allTooltipsOnce) {
        if (easing !== 1)
          return;
        chart.allTooltipsOnce = true;
      }

      chart.options.tooltips.enabled = true;
      Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
        tooltip.initialize();
        tooltip.update();
        tooltip.pivot();
        tooltip.transition(easing).draw();
      });
      chart.options.tooltips.enabled = false;
    }
  }
});


  var options = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: true,
      position: 'bottom',
    },
    tooltips: {
      enabled: true
    },
    title: {
      display: false,
      text: 'chart title'
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    showAllTooltips: false,
    pointHitDetectionRadius: 3
  };
  var chart = new Chart(context, {
    type: 'pie',
    data: data,
    options: options
  });
//  chart.canvas.parentNode.style.height = '400px';
};

function initMap() {
  map = new google.maps.Map(document.getElementById('card-map'), {
    zoom: 10,
    center: new google.maps.LatLng(lat, lng),
    mapTypeId: 'roadmap'
  });

  var script = document.createElement('script');
  script.src = scriptSrc;
  document.getElementsByTagName('head')[0].appendChild(script);


  var polygonArr = new Array();
  polygonData.forEach(function(item) {

    var re = new RegExp(userData.wide + ' ' + userData.city + ' ?[0-9, a-z, A-Z, 가-힣, -, _]*', 'gi');

    if(!item['상권명칭'].match(re)) return;

    var polygonCoords = new Array();
    var splitCoords = item['포인트'].split('|');
    splitCoords.forEach(function(currentValue) {
      polygonCoords.push(new google.maps.LatLng(
        parseFloat(currentValue.split(',')[0]),
        parseFloat(currentValue.split(',')[1])
      ));
    });

    var polygon = new google.maps.Polygon({
      path: polygonCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
    polygon.setMap(map);
  });

  google.maps.event.addListener(map, 'click', function(event) {
    if(openInfowindow)
      openInfowindow.close();
  });
}

window.return_data = function(results) {
  var infowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  for(var i=0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1], coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
    bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));

    var content = '<div><center>' + results.features[i].label + ' (' + results.features[i].category1 + ')</center><br/><br/>';
    content += results.features[i].category2 + '<br/><br/>';
    content += results.features[i].address1 + '<br/>';
    content += results.features[i].address2 + '<br/>';
    content += '<br/>' + coords[1] + ' ' + coords[0];
    content += '</div>';

    google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
      return function() {
        openInfowindow = infowindow;
        infowindow.setContent(content);
        infowindow.open(map, marker);
      };
    })(marker, content, infowindow));
  }
  map.fitBounds(bounds);
  map.panToBounds(bounds);
}

function ajaxTwitter(userData) {
  $.ajax({
    type: 'GET',
    url: url + '/keywords?twitter=' + sessionStorage.getItem('user_twitter'),
    dataType: 'json',
    success: function(response) {
      $('#twitter-header').html('<i class="fa fa-twitter"></i> ' + sessionStorage.getItem('user_twitter'));
      $.each(response[0].trends, function(index, item) {
        var child = '<a class="list-group-item justify-content-between" id="tweet" style="height: 43px; padding: 10px 15px;" href="' + item.url + '">' + item.name;
        if(item.tweet_volume)
          child += '<span class="badge badge-default badge-pill">' + item.tweet_volume + '</span>';
        child += '</a>';
        $('#tweets').append(child);
        return index<10;
      });
      $('#loading-twitter').hide();
    },
    error: function(error) {

    }
  });
};

function ajaxLine(userData) {
  $.ajax({
    type: 'GET',
    url: url + '/line?wide=' + encodeURIComponent(userData.wide) + '&city=' + encodeURIComponent(userData.city) + '&category=' + encodeURIComponent(userData.category),
    dataType: 'json',
    success: function(response) {
      $('#line-header').html('<i class="fa fa-line-chart"></i> ' + userData.wide + ' ' + userData.city + ' 내 ' + userData.category + ' 기간별 추이');
      $('#loading-line').hide();
      drawLinechart($('#line').get(0).getContext('2d'), response);
    },
    error: function(error) {
      alert('서버와의 연결에 문제가 발생했습니다.');
    }
  });
};

function ajaxPie(userData) {
  $.ajax({
    type: 'GET',
    url: url + '/pie?wide=' + encodeURIComponent(userData.wide) + '&city=' + encodeURIComponent(userData.city) + '&category=' + encodeURIComponent(userData.category),
    dataType: 'json',
    success: function(response) {
      $('#pieWide-header').html('<i class="fa fa-pie-chart"></i> ' + userData.category + ' 시/군/구별 분포');
      drawPiechart($('#pieWide').get(0).getContext('2d'), response.wide);
      $('#loading-pieWide').hide();
      $('#pieCity-header').html('<i class="fa fa-pie-chart"></i> ' + userData.category + ' 동/읍/면/리별 분포');
      drawPiechart($('#pieCity').get(0).getContext('2d'), response.city);
      $('#loading-pieCity').hide();
      $('#pieCategory-header').html('<i class="fa fa-pie-chart"></i> ' + userData.category + ' 소분류 분포');
      drawPiechart($('#pieCategory').get(0).getContext('2d'), response.category);
      $('#loading-pieCategory').hide();

    },
    error: function(error) {
      alert('서버와의 연결에 문제가 발생했습니다.');
    }
  });

};
