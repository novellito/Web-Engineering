import 'jquery';
import {deck} from './lib';
import 'bootstrap';
import './styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import {setTimeout} from 'timers';

let start = false;
$(".player1, .player2, .dealer, .newGame").css('display', 'none');
let socket = io('http://localhost:3000');

$('.start').click(function () {
    socket.emit('startGame');
  
});

$('.hit').click(function () {
    socket.emit('hit');
});

$('.newGame').click(function () {
    socket.emit('newGame');
});

$('.stay').click(function () {
    $('.stay').prop('disabled', true);
    $('.hit').prop('disabled', true);
    socket.emit('stay');
});

socket.on('empty', () => {
    $(".player1, .player2, .dealer").empty();    
})

socket.on('start', () => {
    $('.start').remove();
    $('.newGame').show();
});

socket.on('hand', (hand) => {
    $('.gameStat')
        .text('Player1s turn')
        .show();
    console.log(hand);
    $(".player1, .dealer").css('display', 'block');
    $(".player1").append(`<br><img src="assets/${hand.hand1.hand[0].val}_of_${hand.hand1.hand[0].suit}.svg" style="width:100px;"> `);
    setTimeout(() => {
        $(".player1").append(`<img src="assets/${hand.hand1.hand[1].val}_of_${hand.hand1.hand[1].suit}.svg" style="width:100px;">  `);
        $(".player1").append(`<br><p> Total ${hand.total1}</p>`);
    }, 500);
    if (hand.hand2) {
        $(".player2").css('display', 'block');
        setTimeout(() => {
            $(".player2").append(`<br><img src="assets/${hand.hand2.hand[0].val}_of_${hand.hand2.hand[0].suit}.svg" style="width:100px;"> `);
        }, 1000);

        setTimeout(() => {
            $(".player2").append(`<img src="assets/${hand.hand2.hand[1].val}_of_${hand.hand2.hand[1].suit}.svg" style="width:100px;">  `);
            $(".player2").append(`<br><p> Total ${hand.total2}</p>`);
        }, 1500);

        setTimeout(() => {
            $(".dealer").append(`<br><img src="assets/${hand.dealerHand.hand[0].val}_of_${hand.dealerHand.hand[0].suit}.svg" style="width:100px;"> `);
        }, 2000);
        setTimeout(() => {
            $(".dealer").append(`<img src="assets/back.png" style="width:100px;">`);
        }, 2500);
    } else {
        setTimeout(() => {
            $(".dealer").append(`<br><img src="assets/${hand.dealerHand.hand[0].val}_of_${hand.dealerHand.hand[0].suit}.svg" style="width:100px;"> `);
        }, 1000);
        setTimeout(() => {
            $(".dealer").append(`<img src="assets/back.png" style="width:100px;">`);
        }, 1500);
    }
});

socket.on('p1_turn', () => {
    $('.hit').prop('disabled', false);
    $('.stay').prop('disabled', false);
});

socket.on('p2_turn', () => {
    $('.hit').prop('disabled', false);
    $('.stay').prop('disabled', false);
});

socket.on('bust', (res) => {
    $('.hit').prop('disabled', true);
    $('.stay').prop('disabled', true);
    if (res === 'player1 busted') {
        $('.gameStat')
            .text(res)
            .show()
            .hide(1700, function () {
                socket.emit('updateStat'); //move to next player when busted
            });
    } else if (res === 'player2 busted') {
        $('.gameStat')
            .text(res)
            .show();
    } else {
        $('.gameStat')
            .text("Dealer busted!")
            .show();
    }
});

socket.on('updateTable', (res) => {
    if (res.player === 'player1') {
        $(".player1 img, .player1 p").remove();
        console.log(res.playHand.hand);
        for (let hand of res.playHand.hand) {
            $(".player1").append(`<img src="assets/${hand.val}_of_${hand.suit}.svg" style="width:100px;"> `);
        }
        $(".player1").append(`<p> Total ${res.total}</p>`);

    } else if (res.player === 'player2') {
        $(".player2 img, .player2 p").remove();
        for (let hand of res.playHand.hand) {
            $(".player2").append(`<img src="assets/${hand.val}_of_${hand.suit}.svg" style="width:100px;"> `);
        }
        $(".player2").append(`<p> Total ${res.total}</p>`);
        
    } else if (res.player === 'dealer') {
        $(".dealer img, .dealer p").remove();
        for (let hand of res.playHand.hand) {
            $(".dealer").append(`<img src="assets/${hand.val}_of_${hand.suit}.svg" style="width:100px;"> `);
        }
        $(".dealer").append(`<p> Total ${res.total}</p>`);
    }
});

socket.on('newStat', (res) => {
    $('.gameStat')
        .text(res)
        .show(1000);

    if(res === 'player1 busted -- dealer wins!') { // catch an edge case
        $('.hit').prop('disabled', true);
        $('.stay').prop('disabled', true);
        $('.gameStat')
        .text(res)
        .show(1000);
    }
});