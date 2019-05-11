
$(function () {
	$(document).ready(function(){
		var isMyTurn = true;
		var socket = io.connect('/');
		var username = $("#username");
		var status = $("#status");
		var send_username =  $("#send_username");
		var chatroom = $("#chatroom");
		var btn =  $('#table button');
		//listen message
		socket.on("new_message",(data)=>{
		   console.log(data);
		   chatroom.append("<p>"+ data.username+": " + data.message + "</p>")
		});
		//send check btn;
		btn.on('click',function(){
			var position = $(this).attr('id');
			if (isMyTurn) socket.emit('click_btn',{position : position});
		});
		//listen check btn
		socket.on('click_btn',(data)=>{
			console.log(data);
			if(data.username === username.val()){
				$('#'+data.position).html('<span style="color:red">X</span>');
				isMyTurn = false;
            }
			else {
				$('#'+data.position).html('<span style="color:blue">O</span>');
				isMyTurn = true;
            };
		});
		status.on('click',function(){
			console.log('im ready!');
            $('#status').hide();
            socket.emit('change_status',{});
		});
		
		socket.on('change_status',(data)=>{
			chatroom.append("<p>"+ data.username+" is ready !....</p>");
            if ($('#chatroom p').length > 1){
                $('#go').val('Go').show();
            }
		});
		socket.on('go',(data)=>{
			$('#send_username').hide();
			$('#chatroom').hide();
            $('#go').hide();
            $('#username').prop('readonly', true);
            socket.emit('change_listen',{});
		});
		$('#go').on('click',function(){
            $('#send_username').hide();
            $('#chatroom').hide();
            $('#go').hide();
            $('#username').prop('readonly', true);
			socket.emit('go',{});
		});
		send_username.on('click',function () {
			var val = username.val();
			console.log(val);
			socket.emit('change_username',{username : val});
		})
	});
});
