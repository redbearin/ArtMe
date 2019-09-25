'use strict';
$(document).ready(intializeApp);

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var max_matches = 2;
var attempts = null;
var games_played = 0;
var comparingCards = false;

//initialize the app and set up handlers
function intializeApp() {
  createCards();
  $('#win-modal').hide();
  $('.card').on('click', '.face', handleCardClick);
  $('.modal').on('click', 'button', handleResetGame);
  $('.entry-button').on('click', enterGame);
  $('.stats-button').on('click', toggleStats);
}

function enterGame(event) {
  $('.start-modal').addClass('hidden');
}

function toggleStats(event) {
  $('.stats').toggle();
  if ($('.stats-button').hasClass('rotate')){
    $('.stats-button').removeClass('rotate').addClass('normal');
  } else {
    $('.stats-button').removeClass('normal').addClass('rotate');
  }
}

function handleCardClick(event){
  if (comparingCards) {
    return;
  }

  if($(this).hasClass('locked')) {
    return;
  }

  //first guess (card clicked)
  if (firstCardClicked === null) {
    firstCardClicked = $(this);
    firstCardClicked.addClass('hidden');
    firstCardClicked.siblings().addClass('visited');

  //second guess (second card clicked)
  } else {
    secondCardClicked = $(this);
    secondCardClicked.addClass('hidden');
    attempts++;
    comparingCards = true;

    //same card clicked twice
    if (secondCardClicked.hasClass('visited')) {
      secondCardClicked.removeClass('visited');
      hideSelection();
      comparingCards = false;
      return;
    }

    //two cards are the same
    //
    if($(firstCardClicked).next().attr('id') === $(secondCardClicked).next().attr('id')) {
      console.log('cards match');
      var artistId = $(secondCardClicked).next().attr('id');
      audioDescription(artistId);
      matches++;
      displayStats();
      $(firstCardClicked).siblings().addClass('locked');
      $(secondCardClicked).siblings().addClass('locked');
      firstCardClicked.removeClass('visited');
      firstCardClicked = null;
      secondCardClicked = null;
      comparingCards = false;


       //all the cards have been matched
      if(max_matches === matches) {
        games_played++;
        displayStats();
        $('#win-modal').show();
      }
    //two cards are not the same
    } else {
      console.log('cards do not match');
      setTimeout(hideSelection, 1500); 
      displayStats();
    }
  }
}

//hides a match
function hideSelection(){
  $(firstCardClicked).removeClass('hidden');
  $(secondCardClicked).removeClass('hidden');
  //returns cards to initial position with person's face hidden
  firstCardClicked = null;
  secondCardClicked = null;
  comparingCards = false;
}

//displays game stats
function displayStats() {
  var accuracy = calculateAccuracy();
  $('.games-played').text(games_played);
  $('.attempts').text(attempts);
  $('.accuracy').text(accuracy);
}

//calculates guessing accuracy
function calculateAccuracy() {
  if (attempts === 0) {
    return 'NA';
  } else {
    return ((matches / attempts)* 100).toFixed(0) + "%";
  }
}

//resets stats
function resetStats() {
  // games_played;
  matches = 0;
  attempts = 0;
  displayStats();
}

//resets game
function handleResetGame(){
  $('#win-modal').hide();
  $('.back').removeClass('hidden');
  resetStats();
  for (var i = 1; i <=9; i++ ) {
    var myid = '#front' + i;
    $(myid).removeClass('locked');
  }
}

function audioDescription(artistId) {
  var audio;
  if (artistId === 'front1') {
    audio = new Audio('audio/dali.mp3');
  }
  if (artistId === 'front2') {
    audio = new Audio('audio/kahlo.mp3');
  }
  if (artistId === 'front3') {
    audio = new Audio('audio/lichtenstein.mp3');
  }
  if (artistId === 'front4') {
    audio = new Audio('audio/matisse.mp3');
  }
  if (artistId === 'front5') {
    audio = new Audio('audio/okeeffe.mp3');
  }
  if (artistId === 'front6') {
    var audio = new Audio('audio/picasso.mp3');
  }
  if (artistId === 'front7') {
    audio = new Audio('audio/warhol.mp3');
  }
  if (artistId === 'front8') {
    audio = new Audio('audio/guayasamin.mp3');
  }
  if (artistId === 'front9') {
    audio = new Audio('audio/rothko.mp3');
  }
  audio.play();
}

//shuffles card order
function shuffleCards() {
  var array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19 ];
  for (var i = array.length-1; i >= 0; i--) {  
      var randomIndex = Math.floor(Math.random()*(i+1)); 
      var itemAtIndex = array[randomIndex];        
      array[randomIndex] = array[i]; 
      array[i] = itemAtIndex;
  }
  return array;
}

//build cards in random order
function createCards() {
  var array = shuffleCards();
  var newId;
  for (var i = 0; i < array.length; i++) {
    if (array[i] > 10) {
      newId = 'front' + (parseInt(array[i]) - 10);
    } else {
      newId = 'front' + array[i];          
    }
    var newClass = 'front' + array[i] + ' face';
    var newFrontDiv = $('<div>').addClass(newClass).attr('id', newId);
    $('.card-container').append(
      $('<div>', {'class': 'card-wrapper'}).append(
      $('<div>', {'class': 'card'}).append(
          $('<div>', {'class': 'back face'}), $(newFrontDiv))
      )
    )
  }
}
