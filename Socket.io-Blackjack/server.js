var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)

let player1, player2, dealersTurn = false;
let bustedPlayers = [];
let player1_ID,
  shuffledDeck,
  player2_ID,
  hand1,
  hand2,
  dealerHand = '';

const shuffle = function () {

  const deck = [
    {suit:'clubs',val:'ACE'}, {suit:'clubs',val:2},  {suit:'clubs',val:3},  {suit:'clubs',val:4},
    {suit:'clubs',val:5}, {suit:'clubs',val:6}, {suit:'clubs',val:7}, {suit:'clubs',val:8}, 
    {suit:'clubs',val:9},  {suit:'clubs',val:10}, {suit:'clubs',val:'JACK'}, {suit:'clubs',val:'QUEEN'},{suit:'clubs',val:'KING'},
    {suit:'spades',val:'ACE'}, {suit:'spades',val:2},  {suit:'spades',val:3},  {suit:'spades',val:4},
    {suit:'spades',val:5}, {suit:'spades',val:6}, {suit:'spades',val:7}, {suit:'spades',val:8}, 
    {suit:'spades',val:9},  {suit:'spades',val:10}, {suit:'spades',val:'JACK'}, {suit:'spades',val:'QUEEN'},{suit:'spades',val:'KING'},
    {suit:'hearts',val:'ACE'}, {suit:'hearts',val:2},  {suit:'hearts',val:3},  {suit:'hearts',val:4},
    {suit:'hearts',val:5}, {suit:'hearts',val:6}, {suit:'hearts',val:7}, {suit:'hearts',val:8}, 
    {suit:'hearts',val:9},  {suit:'hearts',val:10}, {suit:'hearts',val:'JACK'}, {suit:'hearts',val:'QUEEN'},{suit:'hearts',val:'KING'},
    {suit:'diamonds',val:'ACE'}, {suit:'diamonds',val:2},  {suit:'diamonds',val:3},  {suit:'diamonds',val:4},
    {suit:'diamonds',val:5}, {suit:'diamonds',val:6}, {suit:'diamonds',val:7}, {suit:'diamonds',val:8}, 
    {suit:'diamonds',val:9},  {suit:'diamonds',val:10}, {suit:'diamonds',val:'JACK'}, {suit:'diamonds',val:'QUEEN'},{suit:'diamonds',val:'KING'},
  ];

  let j, x, i;
  for (i = deck.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = deck[i];
    deck[i] = deck[j];
    deck[j] = x;
  }

  shuffledDeck = deck;
};

app.get('/', function (req, res) {
  res.send('<h1>What are you doing here :O</h1>');
});

io.on('connection', function (socket) {

  socket.join('gameRoom', () => {

    if (player1) {
      player2 = true;
      player2_ID = socket.id;
      console.log('player2 connected');
    } else {

      player1 = true;
      player1_ID = socket.id;
      console.log('player1 connected');
    }

    socket
      .on('disconnect', function () {
        if (socket.id === player1_ID) {
          player1_ID,
          hand1,
          hand2 = '';
          dealersTurn, player1 = false;
          bustedPlayers = [];
          console.log('player1 disconnected');

        } else {
          player2_ID,
          hand1,
          hand2 = ''
          dealersTurn, player2 = false;
          bustedPlayers = [];

          console.log('player2 disconnected');
        }

      });

    socket.on('startGame', function (res) {
     start();
    });

    socket.on('hit', function () {
      if (socket.id === player1_ID) {
        hit(hand1);
      } else if (socket.id === player2_ID) {
        console.log('player 2 hitting');
        hit(hand2);
      }
    });
  });

  socket.on('stay', function () {

    if (socket.id === player1_ID) {

      if (player2) {
        // if 2 player game
        io
          .to(player2_ID)
          .emit('p2_turn'); //player 2 turn
        io.emit('newStat', "player2's turn");
      } else {
        dealersTurn = true;
        io.emit('newStat', "Dealer's Turn!");
        dealer();
      }

    } else if (socket.id === player2_ID) { // dealer's turn
      console.log('player2 stayed');
      dealersTurn = true;
      io.emit('newStat', "Dealer's Turn!");
      dealer();
    }
  });

  socket.on('updateStat', function () {
    if (player2) {
      io
        .to(player2_ID)
        .emit('p2_turn'); //player 2 turn
      io.emit('newStat', 'Player2s Turn');
    } else {
      dealersTurn = true;
      dealer();
    }
  });

  socket.on('newGame', () => {

    io.emit('empty');
    shuffle();
    hand1
    hand2, dealerHand = '';
    dealersTurn = false;
    bustedPlayers = [];
    start();
  });

  function deal() {
    shuffle();    
    let hand = [];
    hand.push(shuffledDeck.pop());
    hand.push(shuffledDeck.pop());
    return {hand};
  }

  function hit(playHand) {
    
    playHand
      .hand
      .push(shuffledDeck.pop());

    if (dealersTurn) {
      console.log('dealer hitting!');
      io.emit('updateTable', {
        playHand: dealerHand,
        player: 'dealer',
        total: calculateHand(dealerHand)
      });
    } else if (socket.id === player1_ID) {
      io.emit('updateTable', {
        playHand,
        player: 'player1',
        total: calculateHand(playHand)
      });
    } else if (socket.id === player2_ID) {
      io.emit('updateTable', {
        playHand,
        player: 'player2',
        total: calculateHand(playHand)
      });
    }

    if (calculateHand(playHand) > 21) {

      if (dealersTurn) {
        
        io.emit('updateTable', {
          playHand:dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
      } else if (socket.id === player1_ID) {

        if (!player2) { // only player1 busts
          io.emit('newStat', 'player1 busted -- dealer wins!');
          io.emit('updateTable', {
            playHand: dealerHand,
            player: 'dealer',
            total: calculateHand(dealerHand)
          });
        } else {
          io.emit('bust', 'player1 busted');
          bustedPlayers.push('player1');
          console.log('player1 busted');
        }

      } else if (socket.id === player2_ID) {
        bustedPlayers.push('player2');

        if (bustedPlayers.includes('player1')) {
          console.log('both busted -- dealer wins!');
          io.emit('newStat', 'both busted -- dealer wins!');
          io.emit('updateTable', {
            playHand: dealerHand,
            player: 'dealer',
            total: calculateHand(dealerHand)
          });
        } else {
          io.emit('bust', 'player2 busted');
          console.log('player2 busted');
          dealersTurn = true;
          dealer();
        }
      }
    }
  }

  function dealer() {
    if (calculateHand(dealerHand) >= 17) {
      console.log('dealer done hitting! (greater than 17 already)');
      io.emit('updateTable', {
        playHand: dealerHand,
        player: 'dealer',
        total: calculateHand(dealerHand)
      });
      compare();
    } else {
      while (calculateHand(dealerHand) < 17) {
        hit(dealerHand);
        if (calculateHand(dealerHand) >= 17) {
          console.log('dealer done hitting!');
          compare();
          break;
        }
      }
    }
  }

  function compare() {
    console.log('comparing');
    let winners = [];
    if (player2) {
      if (calculateHand(dealerHand) > 21) { // dealer busted --> check everyones hands
        if (!bustedPlayers.includes('player1') && !bustedPlayers.includes('player2')) {
          io.emit('newStat', 'Dealer busted! -- Both players win!');
          io.emit('updateTable', {
            playHand: dealerHand,
            player: 'dealer',
            total: calculateHand(dealerHand)
          });
          console.log('both wins');

        } else if (!bustedPlayers.includes('player1')) {
          io.emit('newStat', 'player1 wins!');
          io.emit('updateTable', {
            playHand: dealerHand,
            player: 'dealer',
            total: calculateHand(dealerHand)
          });
          console.log('player1 wins');

        } else if (!bustedPlayers.includes('player2')) {
          io.emit('newStat', 'player2 wins!');
          io.emit('updateTable', {
            playHand: dealerHand,
            player: 'dealer',
            total: calculateHand(dealerHand)
          });
          console.log('player2 wins');
        }
      }

      if (!bustedPlayers.includes('player1') && (calculateHand(hand1) > calculateHand(dealerHand)) && !(calculateHand(dealerHand) > 21)) { //check if player2 exists
        winners.push('player1 wins!');
        io.emit('updateTable', {
          playHand: dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
      } else if (!bustedPlayers.includes('player1') && calculateHand(hand1) === calculateHand(dealerHand)) {
        winners.push('player1 & dealer tie');
        io.emit('updateTable', {
          playHand: dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
      }
      if (!bustedPlayers.includes('player2') && (calculateHand(hand2) > calculateHand(dealerHand)) && !(calculateHand(dealerHand) > 21)) { //check if player2 exists
        winners.push('player2 wins!');
        io.emit('updateTable', {
          playHand: dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
      } else if (!bustedPlayers.includes('player2') && calculateHand(hand2) === calculateHand(dealerHand)) {
        winners.push('player2 & dealer tie');
        console.log('both ties');
        io.emit('updateTable', {
          playHand: dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
      }
      if ((((calculateHand(hand1) < calculateHand(dealerHand)) && (calculateHand(hand2) < calculateHand(dealerHand))) || (bustedPlayers.includes('player1') || bustedPlayers.includes('player2'))) && !(calculateHand(dealerHand) > 21)) {
        io.emit('newStat', 'Dealer wins!');
        io.emit('updateTable', {
          playHand: dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
        console.log('dealer wins -- 2playergame');
      }

      if (winners.length !== 0) {
        io.emit('newStat', winners);
      }

    } else {

      if (calculateHand(dealerHand) > 21) { // dealer busted --> check everyones hands
        if (!bustedPlayers.includes('player1')) {
          io.emit('newStat', 'Dealer busted! -- Player1 Wins!');
          io.emit('updateTable', {
            playHand: dealerHand,
            player: 'dealer',
            total: calculateHand(dealerHand)
          });
        }
      }

      if ((!bustedPlayers.includes('player1')) && (calculateHand(hand1) > calculateHand(dealerHand)) && !(calculateHand(dealerHand) > 21)) {
        io.emit('newStat', 'player1 wins!');
        io.emit('updateTable', {
          playHand: dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
      } else if (!bustedPlayers.includes('player1') && calculateHand(hand1) === calculateHand(dealerHand)) {
        io.emit('newStat', 'player1 & dealer push!');
        io.emit('updateTable', {
          playHand: dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
      }

      if ((calculateHand(hand1) < calculateHand(dealerHand)) && !(calculateHand(dealerHand) > 21)) {
        io.emit('newStat', 'Dealer wins!');
        io.emit('updateTable', {
          playHand: dealerHand,
          player: 'dealer',
          total: calculateHand(dealerHand)
        });
      }
    }
  }

  function calculateHand(hand) {
    let handSum = 0;
    for (let i = 0; i < hand.hand.length; i++) {
      if (hand.hand[i].val === 'JACK' || hand.hand[i].val === 'QUEEN' || hand.hand[i].val === 'KING') { //face + face
        handSum += 10;
      } else if (hand.hand[i].val === 'ACE') {
        if (handSum === 10) { //blackjack
          handSum = 21;
        } else if (handSum < 11) {
          handSum += 11;
        } else if (handSum > 11) {
          handSum += 1;
        }
      } else {
        handSum += hand.hand[i].val; // both are just numbers
      }
    }
    return handSum;
  }

  
  function start() {

    dealersTurn = false;

    io.emit('start');
    
    dealerHand = deal();
    hand1 = deal();

    if (player2) {

      hand2 = deal();
    io.emit('hand', {
      hand1,
      total1: calculateHand(hand1),
      hand2,
      total2: calculateHand(hand2),
      dealerHand
    });

    if (calculateHand(dealerHand) === 21 && calculateHand(hand1) === 21) { //player 1 and dealer tie at start
      io.emit('newStat', "player1 & dealer tied!");
    } else if (calculateHand(dealerHand) === 21 && calculateHand(hand2) === 21) { //player 2 and dealer tie at start
      io.emit('newStat', "player2 & dealer tied!");
    } else if ((calculateHand(dealerHand) === 21 && calculateHand(hand1) === 21) && (calculateHand(dealerHand) === 21 && calculateHand(hand2) === 21)) { // 3 way tie
      io.emit('newStat', "3 way tie!! :D");
    } else if (calculateHand(dealerHand) === 21) {
      io.emit('newStat', "dealer has 21 -- dealerWins!");
      io.emit('updateTable', {
        playHand: dealerHand,
        player: 'dealer',
        total: calculateHand(dealerHand)
      });
      console.log('dealer wins! with 21');
    } else if (calculateHand(hand1) === 21) {
      io
      .to(player2_ID)
      .emit('p2_turn'); //player 2 turn if player1 is 21
      io.emit('newStat', "player1 already has 21! -- player2s turn!");
      console.log("player1 already has 21! -- player2s turn!");
    } else {
      io
      .to(player1_ID)
      .emit('p1_turn');
    }
    
  } else { // Case that it's a 1 player game
  
  if (calculateHand(dealerHand) === 21) {
    io.emit('newStat', "dealer has 21 -- dealerWins!");
    io.emit('updateTable', {
      playHand: dealerHand,
      player: 'dealer',
      total: calculateHand(dealerHand)
    });
    // disable buttons -- show reset game...
    console.log('dealer wins! with 21');
  } else if (calculateHand(dealerHand) === 21 && calculateHand(hand1) === 21) { //player 1 and dealer tie at start
    io.emit('newStat', "player1 & dealer tied!");
    io.emit('hand', {
      hand1,
      total1: calculateHand(hand1),
      dealerHand
    });
    } else if (calculateHand(hand1) === 21) {
      io.emit('hand', {
        hand1,
        total1: calculateHand(hand1),
        dealerHand
      });
      io.emit('newStat', "player1 with blackjack! -- player1 wins!");
      console.log('single player1 21!');
    } else {
      io.emit('hand', {
        hand1,
        total1: calculateHand(hand1),
        dealerHand
      });
      io
      .to(player1_ID)
        .emit('p1_turn');
      }
    }
    
  }
});
  
  http.listen(3000, function () {
    console.log('listening on port 3000');
  });