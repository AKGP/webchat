var socket = io.connect();
	var message = $('#message');
	var chat = $('#chat');
	var nickname = $('#nickname');
	var uploader = new SocketIOFileUpload(socket);
	uploader.listenOnInput(document.getElementById("siofu_input"));
	$('#file-btn').click(function(){
		$('#siofu_input').click();
	});
	$('#setNick').submit(function(e){
		e.preventDefault();
		if(nickname.val()!=""){
		socket.emit('new user',nickname.val(),function(data){
			if(data){
				$('#nickWrap').hide();
				$('#contentWrap').show();
			}else{
				$('#nickError').html('Its Already Taken');
			}
		});}
		else{
			$('#nickError').html('You Cannot Be an unknown person :P ');
		}
		nickname.val('');
	});
	socket.on('usernames',function(data){
		var html = '<b>Online Users<br></b>';
		for(var i =0;i<data.length;i++){
			html+=data[i]+"</br>";
		}
		$('#users').html(html);
	});
	$('#send-message').submit(function(e){
		e.preventDefault();
		if(message.val()){
			socket.emit('send message',message.val());
		}
		message.val('');
		return false;
	});

	$('#message-btn').click(function(){
		$('#send-message').submit(function(e){
		e.preventDefault();
		if(message.val()){
			socket.emit('send message',message.val());
		}
		message.val('');
		return false;
	});
	});
	socket.on('new message',function(data){
		chat.append('<div class="msg-txt"><a style="text-decoration:none; color:#000">'+data.nick+':'+ data.time+'</a><div style="color:#000">'+data.msg+'</div></div>');
	});
	socket.on('file-upload',function(data){
		console.log(data);
		var path = data.filepath.substr(6);
		console.log(path);
		$('#chat').append('<div class="msg-img"><a style="text-decoration:none; color:#2c3e50" >'+data.nick+':'+ data.time+'</a>'+'<a href="'+path+'" target="_blank"><img src="'+path+'" > </a></div></br>');
	});