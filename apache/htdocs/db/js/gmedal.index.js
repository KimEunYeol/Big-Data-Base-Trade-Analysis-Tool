var url = 'http://gmedal.xyz:3002'
var map;
var scriptSrc;
var lng, lat;
var markers = new Array();
var openInfowindow;
var userData;
var layout;

var w, h;

$(function() {
  w = parseInt(0.9 * document.getElementById('card-twitter-keyword').offsetWidth);
  h = parseInt(0.9 * document.getElementById('card-twitter-keyword').offsetHeight);

//alert('w: ' + w + '\nh: ' + h);
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
      ajaxScore(userData);
      ajaxLine(userData);
      ajaxPie(userData);
      ajaxTwitter(userData);
//      ajaxScoreText(userData);

/*
      $('<iframe />', {
        name: 'irc',
        id: 'irc',
        src: 'http://127.0.0.1:3001/?username=' + userData.username + '&city=' + encodeURIComponent(userData.wide + '_' + userData.city) + '&category=' + encodeURIComponent(userData.category) + '&join=' + encodeURIComponent('#' + userData.category) + ',' + encodeURIComponent('#' + userData.wide) + '_' + encodeURIComponent(userData.city),
        width: '100%',
        height: '350px',
        frameborder: 0
      }).appendTo($('#chat'));
*/

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

function drawDoughnut(context, data) {
  var doughnut = new Chart(context, {
    type: 'doughnut',
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
    url: url + '/twitter?wide=' + encodeURIComponent(userData.wide) + '&city=' + encodeURIComponent(userData.city) + '&category=' + encodeURIComponent(userData.category),
    dataType: 'json',
    async: true,
    retryCount: 0,
    retryLimit: 1,
    success: function(response) {
      $('#loading-doughnut').hide();
      drawDoughnut($('#score_text').get(0).getContext('2d'), response.feeling);

//var w = parseInt(document.getElementById('tweets').offsetWidth);
//var h = parseInt(document.getElementById('tweets').offsetHeight);
      $('#twitter-header').html('<i class="fa fa-twitter"></i> ' + sessionStorage.getItem('user_twitter'));
      d3.layout.cloud()
        .size([w, h])
        .words(response.words
          .map(function(d) { return {text: d[0], size: d[1]*500+1}; }))
          .padding(1)
          .rotate(function() { return ~~(Math.random() * 0) * 90; })
          .font('Impact')
          .fontSize(function(d) { return d.size; })
          .on('end', draw)
          .start();


//      $.each(response[0].trends, function(index, item) {
//        var child = '<a class="list-group-item justify-content-between" id="tweet" style="height: 43px; padding: 10px 15px;" href="' + item.url + '">' + item.name;
//        if(item.tweet_volume)
//          child += '<span class="badge badge-default badge-pill">' + item.tweet_volume + '</span>';
//        child += '</a>';
//        $('#tweets').append(child);
//        return index<10;
//      });
      $('#loading-twitter').hide();
    },
    error: function(error) {

    }
  });
};

function ajaxScore(userData) {
  $.ajax({
    type: 'GET',
    url: url + '/score?wide=' + encodeURIComponent(userData.wide) + '&city=' + encodeURIComponent(userData.city) + '&category=' + encodeURIComponent(userData.category),
    dataType: 'json',
    timeout: 300000,
    success: function(response) {
      $('#loading-score1').hide();
      $('#loading-score2').hide();
      $('#loading-score3').hide();
      $('#score1').append(
        '<div class="progress-bar" role="progressbar" aria-volume="' + response[0].score + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + response[0].score + '%"></div>' +
        '<span class="progress-type">지역경쟁력</span>' +
        '<span class="progress-completed">' + response[0].score + '점</span>'
      );
      $('#score2').append(
        '<div class="progress-bar progress-bar-success" role="progressbar" aria-volume="' + response[1].score + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + response[1].score + '%"></div>' +
        '<span class="progress-type">업종경쟁력</span>' +
        '<span class="progress-completed">' + response[1].score + '점</span>'
      );
      $('#score3').append(
        '<div class="progress-bar progress-bar-info" role="progressbar" aria-volume="' + response[2].score + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + response[2].score + '%"></div>' +
        '<span class="progress-type">업종안정성</span>' +
        '<span class="progress-completed">' + response[2].score + '점</span>'
      );
    },
    error: function(error) {
    }
  });
};

/*
function ajaxScoreText(userData) {
  $.ajax({
    type: 'GET',
    url: url + '/score_text?wide=' + encodeURIComponent(userData.wide) + '&city=' + encodeURIComponent(userData.city) + '&category=' + encodeURIComponent(userData.category),
    dataType: 'json',
    success: function(response) {
      $('#loading-doughnut').hide();
      drawDoughnut($('#score_text').get(0).getContext('2d'), response);
    },
    error: function(error) {
    }
  });
};
*/

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

function draw(words) {
//  var solidFill = d3.scale.category10();
  var mixedFill = d3.scale.category20();
      d3.select('#tweets').append('svg')
//        .attr('width', 400)
//        .attr('height', 400)
        .attr('width', w)
        .attr('height', h)
//        .attr('viewBox', '0 0 400 400')
//        .attr('viewBox', '0 0 ' + w + ' ' + h)
//          .attr('width', layout.size()[0])
//          .attr('height', layout.size()[1])
//        .attr('preserveAspectRatio', 'xMinYMin meet')
        .append('g')
          .attr('width', w)
          .attr('height', h)
          .attr('transform', 'translate(' + w/2 + ',' + h/2 + ')')
        .selectAll('text')
          .data(words)
        .enter().append('text')
//          .style('font-size', function(d) { return d.size + 'vh'; })
          .style('font-size', function(d) { return d.size + 'px'; })
//          .style('font-size', function(d) { return d.size + 'px'; })
          .style('font-family', 'Impact')
          .style('fill', function(d, i) {
//            if(d.size > 50) return solidFill(i);
//            else return mixedFill(i);
            return mixedFill(i);
          })
//        .style('fill', function(d,i) { return fill(i); })
          .attr('text-anchor', 'middle')
          .attr('transform', function(d) { return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'})
          .text(function(d) { return d.text; });
};
