
var chat = 
	{
		user: null,
		pages: {
			login: null,
			chat: null
		},
		timer: null,
		chatData: null, // last chats
		doLogin: function(user) {
			this.user = user;
			$.mobile.changePage(this.pages.chat);
		},
		loginWithValidation: function () {  
			$('#loginUserLabel').removeClass('missing');
			loginUser = $('#loginUser').val();
			if (loginUser == null || loginUser == "") {
				$('#loginUserLabel').addClass('missing');
				alert('Der Benutzername ist leer.');
				return false;
			}
			this.doLogin(loginUser);
			return false;
		},
		doLogout: function() {
		  this.user = null;
		  $.mobile.changePage(this.pages.login);
		},
		randomUser: function() {
		    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
		    var length = 8;
		
		    var str = '';
		    for (var i = 0; i < length; i++) {
		        str += chars[Math.floor(Math.random() * chars.length)];
		    }
		    return str;
		},
		chat: function(user, text) {
			$.ajax({
			    type: 'GET',
			    url: 'chat.php',
			    dataType: 'json',
			    success: function() { },
			    data: {"user": user, "text": text},
			    async: false
			});
		},
		chatWithValidation: function() {
			var text = $('#chatText').val();
			if (text == null || text == "") {
				return false;
			}
			chat.chat(this.user, text);
			$('#chatText').val('');
			chat.refreshChats($('#chats'));
			return false;
		},
		refreshChats: function(list) {
			$.getJSON('chats.php', { },  function(data) {
				chat.chatData = data;
				var chats = [];
				$.each(data, function(key, val) {
					chats.push('<li><b>' + val.user + '</b>&nbsp;&gt;&nbsp;' + val.text + '</li>');
				  });
			
				$('#chats').html(chats.join(''));
				$('#chats').listview('refresh');
			});
			return false;
		}
	};


// configure
chat.pages.login = '#loginPage';
chat.pages.chat = "#chatPage";


$(document).ready(function() {
	// login page
	$('#loginButton').on('click', function() { return chat.loginWithValidation(); });
	$('#loginUser').val(chat.randomUser());
	$('#loginButton').select();

	// chat page
	$(chat.pages.chat).on('pageshow', function(event, ui) {
		  $('#chatTitle').html(chat.user);
		  chat.refreshChats($('#textarea'));
		  chat.timer = setInterval(function() {
		  	chat.refreshChats($('#textarea')); 
		  	console.log("interval function called");
		  	console.log("chat.user: " + chat.user);
		  	if (chat.user != null && chat.user.indexOf('demo') == 0) { 
		  		var lastChatTime = new Date();
		  		if (chat.chatData[0] != null) {
		  			lastChatTime = Date.parseExact(chat.chatData[0].time, 'yyyy-MM-dd HH:mm:ss');
		    	}
		    	var dateNow = new Date();

				if ((dateNow.getTime() - lastChatTime.getTime()) > 60*1000) {
					$('#chatText').val("Mobile chat application. Open http://student.tlab.ch/chat, login and chat! (Sent at " + dateNow +")");
					chat.chatWithValidation();
		  		}
		  	}
		  }, 4000);
	});
	$(chat.pages.chat).on('pagebeforehide', function(event, ui) {
		clearInterval(chat.timer);
	});
	$('#chatLogout').on('click', function() { return chat.doLogout(); });
	
	$('#chatRefresh').on('dblclick', function() {  /* do nothing */ });
	$('#chatRefresh').on('click', function() { return chat.refreshChats($('#textarea')); });

	$('#chatSend').on('click', function() { return chat.chatWithValidation(); });
	$('#chatText').keypress(function(event) { 
		if ( event.which == 13 ) {
			chat.chatWithValidation();
			event.preventDefault();
		}
	});
});
  