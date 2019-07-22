$(function() {
  var socket = io.connect('http://gmedal.xyz:3002/');
/*
  var div = document.createElement('div');
  div.setAttribute('class', 'row');

  var panel = document.createElement('div');
  panel.setAttribute('class', 'panel panel-primary');
  var panelHead = document.createElement('div');
  panelHead.setAttribute('class', 'panel-heading');
  panelHead.innerHTML = 'Chat';

  var panelBody = document.createElement('div');
  panelBody.setAttribute('id', 'panelBody');
  panelBody.setAttribute('class', 'panel-body');
  panelBody.setAttribute('style', 'height: 300px; max-height: 300px; max-width: 100%, overflow-y: auto; overflow-x: hidden;');
  var table = document.createElement('table');
  table.setAttribute('class', 'table table-hover table-condensed');
  table.setAttribute('id', 'messageTable');
  panelBody.append(table);

  var panelFoot = document.createElement('div');
  panelFoot.setAttribute('class', 'panel-footer');

  panel.append(panelHead);
  panel.append(panelBody);
  panel.append(panelFoot);

  var form = document.createElement('form');
  form.setAttribute('id', 'messageForm');
//  form.setAttribute('class', 'input-group');
  var input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'message');
  input.setAttribute('class', 'form-control');

  form.append(input);

  div.append(panel);
  panelFoot.append(form);

  document.scripts[document.scripts.length-1].parentNode.appendChild(div);
*/
  socket.on('chat', function(msg) {
    $('#messageTable').append($('<tr><td>').text(msg.username + ' : ' + msg.message));
    $('#panelBody').scrollTop($('#panelBody').scrollTop() + $('tr').height());
  });

  $('#messageForm').submit(function() {
    if($('#message').val().length > 0) {
/*
      socket.emit('chat', {
        username: userData.username,
        message: $('#message').val();
      });
*/
      socket.emig('chat', $('#message').val());
      $('#message').val('');
    }
console.log(JSON.stringify({
        username: userData.username,
        message: $('#message').val()
}));
    return false;
  });
});
