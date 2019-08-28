'use strict';
$(document).ready(intializeApp);

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var max_matches = 9;
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

  //first guess (card clicked)
  if (firstCardClicked === null) {
    firstCardClicked = $(this);
    firstCardClicked.addClass('hidden');
    firstCardClicked.siblings().addClass('sibling');

  //second guess (second card clicked)
  } else {
    secondCardClicked = $(this);
    secondCardClicked.addClass('hidden');
    attempts++;
    comparingCards = true;

    //same card clicked twice
    if (secondCardClicked.hasClass('sibling')) {
      secondCardClicked.removeClass('sibling');
      hideSelection();
      comparingCards = false;
      return;
    }

    //two cards are the same
    //
    if($(firstCardClicked).next().attr('id') === $(secondCardClicked).next().attr('id')) {
      console.log('cards match');
      matches++;
      displayStats();
      firstCardClicked.removeClass('sibling');
      firstCardClicked = null;
      secondCardClicked = null;
      comparingCards = false;

       //all the cards have been matched
      if(max_matches === matches) {
        $('#win-modal').show();
        games_played++;
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
