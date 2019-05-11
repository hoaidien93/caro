
$(function () {
	let width = 12;
	let height = 20;
	function showResult(isWin){
		if(isWin){
			$('#result').text('You win !');
		}
		else{
			$('#result').text('You lose !');
		}
		$('#ex1').modal('open');
	}
	function checkWin(arr){
		//Win return 1
		//Lose return -1
		//Nothing return 0
		for(var i=0;i<height;i++){
			for(var j=0;j<width;j++){
				if(arr[i][j] === 0) continue;
				//Check hang ngang
				if(j < width - 5){
					if ((arr[i][j] + arr[i][j+1] + arr[i][j+2] + arr[i][j+3] + arr[i][j+4]) === 5) return 1;
					if ((arr[i][j] + arr[i][j+1] + arr[i][j+2] + arr[i][j+3] + arr[i][j+4]) === -5) return -1;
				}
				//Check hang doc
				if(i < height - 5){
					if ((arr[i][j] + arr[i+1][j] + arr[i+2][j] + arr[i+3][j]+ arr[i+4][j]) === 5) return 1;
					if ((arr[i][j] + arr[i+1][j] + arr[i+2][j] + arr[i+3][j]+ arr[i+4][j]) === -5) return -1;
				}
				//Check hang cheo
				//Cheo phai
				if(i < height - 5 && j < width - 5){
					if((arr[i][j] + arr[i+1][j+1] + arr[i+2][j+2] + arr[i+3][j+3] + arr[i+4][j+4]) === 5) return 1;
					if((arr[i][j] + arr[i+1][j+1] + arr[i+2][j+2] + arr[i+3][j+3] + arr[i+4][j+4]) === -5) return -1;
				}
				//Cheo trai
				if(i < height - 5 && j >= 4){
					if((arr[i][j] + arr[i+1][j-1] + arr[i+2][j-2] + arr[i+3][j-3] + arr[i+4][j-4]) === 5) return 1;
					if((arr[i][j] + arr[i+1][j-1] + arr[i+2][j-2] + arr[i+3][j-3] + arr[i+4][j-4]) === -5) return -1;
				}
			}
		}
		return 0;
	}

	$(document).ready(function(){
		//array 12-20
		var arr = [[]];
		for(var i=0;i<height;i++){
			for(var j=0;j<width;j++){
				if(j === 0) arr[i] = [];
				arr[i][j] = 0;
			}
		}
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
			var pos = {
				'x' : parseInt(position.split('-')[0]),
				'y' : parseInt(position.split('-')[1])
			};
			if (isMyTurn && arr[pos.x][pos.y] === 0){
				socket.emit('click_btn',{position : position});
			}
		});
		//listen check btn
		socket.on('click_btn',(data)=>{
			var pos = {
				'x' : parseInt(data.position.split('-')[0]),
				'y' : parseInt(data.position.split('-')[1])
			};
			if(data.username === username.val()){
				$('#'+data.position).html('<span style="color:red">X</span>');
				isMyTurn = false;
				arr[pos.x][pos.y] = 1;
            }
			else {
				$('#'+data.position).html('<span style="color:blue">O</span>');
				isMyTurn = true;
				arr[pos.x][pos.y] = -1;
			};
			var result = checkWin(arr);
			if(result === 1){
				showResult(true);
			}
			if(result === -1){
				showResult(false);
			}
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
			alert('Start');
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

	$("#closeModel").on('click',function(){
		document.location.reload();
	});
});
