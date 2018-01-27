 // Initialize Google Firebase
  var config = {
    apiKey: "AIzaSyByyBYc7GoEkCfDMgbJJpFyFykBl1jjrzs",
    authDomain: "rpsfirebasencb.firebaseapp.com",
    databaseURL: "https://rpsfirebasencb.firebaseio.com",
    projectId: "rpsfirebasencb",
    storageBucket: "rpsfirebasencb.appspot.com",
    messagingSenderId: "244628581855"
  };
  firebase.initializeApp(config);


  //Var to reference Firebase Database
  var database = firebase.database();

  //Var to reference Player
  var player = '';

  //Var to reference Player 1
  var player1name = "";

  //Var to reference Player 2
  var player2name = "";

  //Var to reference Player 1's choice
  var player1choice = "";

  //Var to reference Player 2's choice
  var player2choice = "";

  //Var to reference alert window
  var alertwindow = "";

  //Var to player 1's wins
  var player1wins = 0;

  //Var to player 1's losses
  var player1losses = 0;

  //Var to player 2's wins
  var player2wins = 0;

  //Var to player 2's losses
  var player2losses = 0;
  var turns = 1;
  var timedelay;
  var timedelay2;
  var resetgame = false;


$(document).ready(function(){

	//Checking the Score
	var derivewinner={
			//Reset Game
			resetGame : function(){
				resetgame = false;
				turns = 1;
				//Update Turns
					database.ref().update({
								turn: turns
					});
			},
			//Clear Timeout and then Reset
			clearDelay : function(){
				clearTimeout(timedelay);
				derivewinner.resetGame();
			},
		
			winner1notice : function (){
				$("#winner").html( player1name + " wins!!");
			},
	
			winner2notice : function (){
				$("#winner").html( plpayer2name + " wins!!");
			},
	
			updateScore: function(){
				database.ref("players/1").update({		
						win: player1wins,
						lose: player1losses,	
				});//database update
				database.ref("players/2").update({
						win: player2wins,
						lose: player2losses,
				});//database update
			},
	
			playerscore : function (){
			

				if(player1choice == "rock" && player2choice == "scissors") {	
					player1wins++;
					player2losses++;
					derivewinner.winner1notice();
					derivewinner.updateScore();
				}
		
				if(player1choice == "rock" && player2choice == "paper") {
					player1losses++;
					player2wins++;
					derivewinner.winner2notice();
					derivewinner.updateScore();					
				}
		
				if(player1choice == "scissors" && player2choice == "rock") {					
					player1losses++;
					player2wins++;
					derivewinner.winner2notice();
					derivewinner.updateScore();		
				}
		
				if(player1choice == "scissors" && player2choice == "paper") {					
					player1wins++;
					player2losses++;
					derivewinner.winner1notice();
					derivewinner.updateScore();
				}
		
				if(player1choice == "paper" && player2choice == "rock") {					
					player1wins++;
					player2losses++;
					derivewinner.winner1notice();
					derivewinner.updateScore();				
				}
				
				if(player1choice == "paper" && player2choice == "scissors") {
					player1losses++;
					player2wins++;
					derivewinner.winner2notice();
					derivewinner.updateScore();
				}
	
				if(player1choice == player2choice) {
					$("#winner").html("It's a tie!");
				}

			}
	}

	

	$("#welcomemessage").html("<h2>Enter Your Name to Play</h2>"
						+"</br><input type='text' id='name-input'>" +
						"</br></br><input type='submit' id='submit-name'>");
	$("#waiting1").html("Waiting for player 1");
	$("#waiting2").html("Waiting for player 2");
	
	//Hiding Choices and Messages foor New Game
	function hidden() {
			$("#player1choices").attr("style", "visibility:hidden");
			$("#player2choices").attr("style", "visibility:hidden");
			$("#group2message").attr("style", "visibility:hidden");
			$("#group1message").attr("style", "visibility:hidden");
	}
	hidden();

	database.ref().on("value", function(snapshot){

		function playerDisconnect(){
			if(player != ""){
				
				//if this is Player 1's browser
				if ((snapshot.child("players").child(1).exists()) && (player == snapshot.child("players").child(1).val().name)){					
						//update the message to the database
						database.ref("/chat").onDisconnect().update({							
							message: ((snapshot.child("players").child(1).val().name) + " has been DISCONNECTED!!"),
							dateAdded: firebase.database.ServerValue.TIMESTAMP												
						});
						//delete the player 1 database
						database.ref("players/1").onDisconnect().remove();
				//if this is Player 2's browser
				}else if ((snapshot.child("players").child(2).exists()) && (player == snapshot.child("players").child(2).val().name)){	
						//update the message to the database	
						database.ref("/chat").onDisconnect().update({						
							message: ((snapshot.child("players").child(2).val().name) + " has been DISCONNECTED!!"),
							dateAdded: firebase.database.ServerValue.TIMESTAMP													
						});//database	
						//delete the player 1 database
						database.ref("players/2").onDisconnect().remove();
						//delete the turn database				
						database.ref("/turn").onDisconnect().remove();	
				}
			}
		}
		
		if(((snapshot.child("players").child(1).exists()) == false)){
				$("#waiting1").html("Waiting for player 1");
				$("#winner").empty();
				$("#win1").empty();
				$("#lose1").empty();
				$("#player1-name").empty();
				$("#turnplayer").empty();
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid white");

		};

		if(((snapshot.child("players").child(2).exists()) == false)){
				$("#waiting2").html("Waiting for player 2");
				$("#winner").empty();
				$("#win2").empty();
				$("#lose2").empty();
				$("#player2-name").empty();
				$("#turnplayer").empty();
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid white");
		};

		if((snapshot.child("players").child(2).exists()) && ((snapshot.child("players").child(1).exists()) === false)){
				$("#player2-name").html(snapshot.child("players").child(2).val().name);
				$("#waiting2").empty();
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid white");
				hidden();
	
				playerDisconnect();
		};

		if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)){
				$("#waiting1").empty(); 
				$("#player1-name").html(snapshot.child("players").child(1).val().name);
				hidden();
		
				playerDisconnect();
	
					if(player == snapshot.child("players").child(1).val().name){
							$("#welcomemessage").html("<h2>Hello " + snapshot.child("players").child(1).val().name +  ".  You are player 1!</h2>");					
							$("#win1").html("WIN: " + player1wins);
							$("#lose1").html("LOSE: " + player1losses);
					}

		}else if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()))){
	
				var databaseTurn = snapshot.child("turn").val();
				player1name = snapshot.child("players").child(1).val().name;
	  			plpayer2name = snapshot.child("players").child(2).val().name;

					$("#waiting2").empty();
					$("#waiting1").empty();
					$("#player2-name").html(snapshot.child("players").child(2).val().name);
					$("#player1-name").html(snapshot.child("players").child(1).val().name);
					$("#win2").html("WIN: " + snapshot.child("players").child(2).val().win);
					$("#lose2").html("LOSE: " + snapshot.child("players").child(2).val().lose);
					$("#win1").html("WIN: " + snapshot.child("players").child(1).val().win);
					$("#lose1").html("LOSE: " + snapshot.child("players").child(1).val().lose);
	
					playerDisconnect();
					
		
				if((player == snapshot.child("players").child(1).val().name) && (databaseTurn == 1)){
						$("#welcomemessage").html("<h2>Hello " + snapshot.child("players").child(1).val().name +  ".  You are player 1!</h2>");
						$("#player-1").attr("style", "border: 5px solid purple");
						$("#player-2").attr("style", "border: 5px solid white");
						hidden();
						$("#player1choices").attr("style", "visibility:visible");
							$("#rock1").html("ROCK");
							$("#paper1").html("PAPER");
							$("#scissors1").html("SCISSORS");
						$("#winner").empty();
						$("#turnplayer").html("It's your turn!");
				}
	
				if((player == snapshot.child("players").child(1).val().name) && (databaseTurn == 2)){//after player 1 picks
						$("#player-1").attr("style", "border: 2px solid white");
						$("#player-2").attr("style", "border: 2px solid purple");
						hidden();
						$("#group1message").attr("style", "visibility:visible");
							$("#group1message").html("Chose: " + "<h2>" + player1choice + "</h2>");
						$("#turnplayer").html("Waiting for " + plpayer2name + " to choose...");
				}
				
			
				if((player == snapshot.child("players").child(2).val().name) && (databaseTurn == 1 )){
						$("#welcomemessage").html("<h2>Hello " + snapshot.child("players").child(2).val().name +  ".  You are player 2!</h2>");
						$("#player-1").attr("style", "border: 5px solid purple");
						$("#player-2").attr("style", "border: 5px solid white");
						$("#turnplayer").html("Wating for " + player1name + " to choose!!");
						hidden();	
						$("#winner").empty();
				}
	
				if((player == snapshot.child("players").child(2).val().name) && (databaseTurn == 2 )){
						$("#player-1").attr("style", "border: 2px solid white");
						$("#player-2").attr("style", "border: 1px solid purple");
						$("#turnplayer").html("It is your turn!"); 
						hidden();							
						$("#player2choices").attr("style", "visibility:visible");
							$("#rock2").html("ROCK");
							$("#paper2").html("PAPER");
							$("#scissors2").html("SCISSORS");				
				}
		
				if(databaseTurn == 3 && resetgame == false){
						resetgame = true;
					
						player1choice = snapshot.child("players").child(1).val().choice;
						player2choice = snapshot.child("players").child(2).val().choice;
						player1wins = snapshot.child("players").child(1).val().win;
						player1losses = snapshot.child("players").child(1).val().lose;
						player2wins = snapshot.child("players").child(2).val().win;
						player2losses = snapshot.child("players").child(2).val().lose;
							
							$("#player-1").attr("style", "border: 5px solid white");
							$("#player-2").attr("style", "border: 5px solid white");
							$("#player2choices").attr("style", "visibility:hidden");
							$("#player1choices").attr("style", "visibility:hidden");
							$("#group2message").attr("style", "visibility:visible");
							$("#group1message").attr("style", "visibility:visible");		
						 		$("#group1message").html("Chose: " + "<h2>" + player1choice + "</h2>");
						 		$("#group2message").html("Chose: " + "<h2>" + player2choice + "</h2>");
							$("#turnplayer").empty();	
		
						derivewinner.playerscore();
			
						timedelay = setTimeout(derivewinner.clearDelay, 5 * 1000);				
				}	
		}
	}); 

	$("#submit-name").on("click", function(){
		
		var username = $("#name-input").val().trim();
	
		player = username;

		    database.ref().once('value').then(function(snapshot) {
	 				
	 				if((snapshot.child("players").child(1).exists()) === false){
							database.ref("players/1").set({
									name : username,
									win: player1wins,
									lose: player1losses
							}); 
					
					}else if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)){
							database.ref("players/2").set({
								name : username,
								win: player2wins,
								lose: player2losses
						}); 
							database.ref().update({
								turn: turns,
						});
					
					}else if ((snapshot.child("players").child(1).exists()) && (snapshot.child("players").child(2).exists())){
					alert("There are two players playing! Try again later!");
					}
			}); 
	}); 

	
	$(".choice1").on("click", function(){
	
			player1choice = $(this).val();

				database.ref().once('value').then(function(snapshot) {
		 		
		 			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
					turns++; 

				
			 		if((player == snapshot.child("players").child(1).val().name)){
						database.ref("players/1").update({		
							choice : player1choice,						
						});
						
						database.ref().update({		
							turn: turns		
						});
					}
				});
	}); 

	$(".choice2").on("click", function(){

			player2choice = $(this).val();

				database.ref().once('value').then(function(snapshot) {
		 		
		 			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
					turns++; //3
					
			
			 		if((player == snapshot.child("players").child(2).val().name)){
						database.ref("players/2").update({									
							choice : player2choice,														
						});
						
						database.ref().update({
							turn: turns,									
						});
					}
				});
			}); 
 	

 				$("#submit-chat").on("click", function(event){

 				event.preventDefault();

				var messages = $("#chat-input").val().trim();
				$("#chat-input").val("");
			
	
				alertwindow = player + " : " + messages;
					
			
				database.ref("/chat").update({		
				message: alertwindow,
				dateAdded: firebase.database.ServerValue.TIMESTAMP								
			});
		}); 

				database.ref("/chat").orderByChild("dateAdded").limitToLast(1).on("value", function(snapshot) {
	    		$("#chat-window").append("</br>" + snapshot.val().message + "</br>");
			});

		});
