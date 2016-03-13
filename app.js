var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
nicknames=[],
siofu = require('socketio-file-upload');
app.use(siofu.router);
app.use(express.static(__dirname+'/public'));
server.listen(8080);
app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});
io.sockets.on('connection',function(socket){

	//On sending message

	socket.on('send message',function(data){
		io.sockets.emit('new message',{msg:data,nick:socket.nickname});
	});

	//Addition of new User

	socket.on('new user',function(data,callback){
		if(nicknames.indexOf(data)!=-1){
			callback(false);
		}
		else{
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			io.sockets.emit('usernames',nicknames);
		}
	});
	
	//When user goes Offline

	socket.on('disconnect',function(data){
		if(!socket.nickname){
			return;
		}
		else{
			nicknames.splice(nicknames.indexOf(socket.nickname),1);
			io.sockets.emit('usernames',nicknames);
		}
	});

	//File Uploader
	
	var uploader = new siofu();
	uploader.dir = 'public/img';
	uploader.listen(socket);
	uploader.on("saved", function(event){
        io.sockets.emit("file-upload",{filepath:event.file.pathName,nick:socket.nickname});
    });
});
console.log("Running");