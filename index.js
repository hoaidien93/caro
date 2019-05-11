const express = require ('express');
const app = express();
var path = require("path");

app.set('view engine', 'hbs');

app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/chat.js',(req,res)=>{
    res.sendFile(path.join(__dirname+'/chat.js'));
});
app.get('/image/background.jpg',(req,res)=>{
	res.sendFile(path.join(__dirname)+'/image/background.jpg');
})
server = app.listen(process.env.PORT || 8080,function () {
	console.log('server is listening....');
});
var io = require('socket.io')(server);
io.on('connection', function(socket){
    socket.username= "Anonymous";
    socket.on('change_username',(data)=>{
       socket.username = data.username;
       console.log(socket.username);
    });
	var listen =false;
	var count = 0;
	//click btn
	socket.on('click_btn',(data)=>{
		console.log(data);
		if (listen) io.sockets.emit('click_btn',{position: data.position, username: socket.username});
	});
	socket.on('change_listen',()=>{
		listen=true;
	});
	socket.on('change_status',(data)=>{
		io.sockets.emit('change_status',{username: socket.username});
	});
	socket.on('go',(data)=>{
		console.log('go');
		listen= true;
		io.sockets.emit('go',{username: socket.username});
	});
    console.log('new user connnected');
});
