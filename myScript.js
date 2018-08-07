document.addEventListener("DOMContentLoaded", function(event) {

    var iconsArray = [
       [1, 'fa-shopping-cart'],
       [1, 'fa-shopping-cart'],
       [2, 'fa-car'],
       [2, 'fa-car'],
       [3, 'fa-bomb'],
       [3, 'fa-bomb'],
       [4, 'fa-bell'],
       [4, 'fa-bell'],
       [5, 'fa-bowling-ball'],
       [5, 'fa-bowling-ball'],
       [6, 'fa-cloud'],
       [6, 'fa-cloud'],
       [7, 'fa-camera'],
       [7, 'fa-camera'],
       [8, 'fa-key'],
       [8, 'fa-key']
    ];
 
    // VARIOUS VARIABLES
    var match = [];
    var item = [];
    var counter = 0;
    var moves = 0;
    var timerRunning = 0;
    var time = 0;
    var secs = 0;
    var mins = "0" + 0;
 
    var gameBoard = document.getElementById("memory-game-board");
    var target = "";
    var refresh = document.getElementById("refresh");
    var bodyId = document.getElementById("body-wrapper");
    var modalId = document.getElementById("modal-wrapper");
    var scoreId = document.getElementById("score");
    var movesId = document.getElementById("moves");
    var btnId = document.getElementById("btn");
    var closeId = document.getElementById("close");
    var timeId = document.getElementById("time");
    var movesCounter = document.getElementById("movesCounter");
    var timerCounter = document.getElementById("timer");
    var starsCounter = document.getElementById("stars-container");
    var fullStar = '<i class="fas fa-star"></i>';
    var emptyStar = '<i class="far fa-star"></i>';
    var intervalCounter = "";
 
    // *****************************************************************
    // SHUFFLE FUNCTION - to randomise the various icons used in the game
    Array.prototype.shuffle = function() {
       for (i = 1; i < this.length; i++) {
          random = Math.round(Math.random() * i);
          temp = this[random];
          this[random] = this[i];
          this[i] = temp;
       }
       return this;
    };
    // *****************************************************************
 
 
    // *****************************************************************
    // SETUP OF THE MEMORY BOARD - assigning all the icons to random cards
    function memoryGameBoard() {
       var htmlCode = "";
       iconsArray.shuffle();
       for (i = 0; i < iconsArray.length; i++) {
          htmlCode += '<div class="card card' + iconsArray[i][0] + '"><i class="fas ' + iconsArray[i][1] + '"></i></div>';
       } //everything below is just resetting everything - clearing the game board
       gameBoard.innerHTML = htmlCode;
       secs = 0;
       mins = "0" + 0;
       match = [];
       item = [];
       moves = 0;
       counter = 0;
       time = 0;
       timerRunning = 0;
       movesCounter.innerHTML = "0 moves";
       timerCounter.innerHTML = "00:00";
       starsCounter.innerHTML = fullStar + fullStar + fullStar;
       stopTimer();
    }
    memoryGameBoard();
    // *****************************************************************
 
 
    // *****************************************************************
    // FLIP CARD AND ASSIGNING A CLICK EVENT
    gameBoard.addEventListener("click", flipCard);
 
    function flipCard(e) {
       target = e.target;
       if (target.classList.contains("card")) {
          if (target.classList.contains("selected")) {
             gameBoard.removeEventListener("click", flipCard); // I remove the event to stop double clicks
             gameBoard.addEventListener("click", flipCard);
          } else {
              console.log(timerRunning)
             target.classList.add("selected");
             matchCards(target); // triggers the function to match cards
             if (timerRunning == 0) { // checking if timer function is running
                timerRunning++;
                intervalCounter = setInterval(function() {
                   timer(); // timer function called
                }, 1000);
             }
             gameMoves(target); // function for activating the star scoring system
          }
       }
    }
    // *****************************************************************
 
 
    // *****************************************************************
    // CHECKING FOR MATCHED FLIPPED CARDS
    function matchCards(element) {
       var cardId = element.classList[1];
       if (item.length == 0) {
          item.push(1); // array to monitor how many cards are active
          match.push(cardId); // array to collect id of card to match
       } else if (item.length == 1) {
          item.push(1);
          match.push(cardId);
          moves++; // monitors how many moves the player has made
          if (match[0] == match[1]) {
             setTimeout(function() {
                success(); //SUCCESS FUNCTION when two cards match
             }, 500);
             counter += 2; // records the matched cards - to know when the game finishes
             match = [];
             item = [];
             if (counter == iconsArray.length) {
                setTimeout(function() {
                   popupModal(); //POPUP MODAL for when the game is complete
                }, 1500);
             }
          } else {
             setTimeout(function() {
                fail(); //FAIL FUNCTION when two cards don't match
             }, 500);
             match = [];
             item = [];
          }
       }
    }
    // FUNCTION WHEN CARDS MATCH
    function success() {
       var selected = document.querySelectorAll(".selected"); // the selected class is a marker to toggle on/off
       selected[0].classList.add("success");
       selected[1].classList.add("success");
       setTimeout(function() {
          selected[0].classList.remove("selected");
          selected[1].classList.remove("selected");
       }, 1000);
    }
    // FUNCTION WHEN CARDS FAIL TO MATCH
    function fail() {
       var selected = document.querySelectorAll(".selected");
       selected[0].classList.add("fail");
       selected[1].classList.add("fail");
       setTimeout(function() {
          selected[0].classList.remove("fail", "selected");
          selected[1].classList.remove("fail", "selected");
       }, 1000);
    }
    // *****************************************************************
 
 
    // *****************************************************************
    // FUNCTION FOR WHEN GAME IS COMPLETE AND MODAL POPS UP WITH CONGRATULATIONS
    function popupModal() {
       bodyId.style.display = "none";
       modalId.style.display = "inline";
       movesId.innerHTML = 'You did it in <span class=\"strong\">' + moves + '</span> moves.';
       // THE STAR SYSTEM - CHANGING FROM SOLID TO EMPTY
       if (moves < 16) {
          scoreId.innerHTML = "Your score was " + fullStar + fullStar + fullStar;
       } else if (moves > 15 && moves < 21) {
          scoreId.innerHTML = "Your score was " + fullStar + fullStar + emptyStar;
       } else {
          scoreId.innerHTML = "Your score was " + fullStar + emptyStar + emptyStar;
       }
    }
    // CLOSING OF MODAL AND/OR STARTING A NEW GAME
    function closeModal() {
       bodyId.removeAttribute("style");
       modalId.removeAttribute("style");
       memoryGameBoard();
    }
    closeModal();
    btnId.addEventListener("click", closeModal);
    closeId.addEventListener("click", closeModal);
    // REFRESHING OF THE GAME BOARD
    refresh.addEventListener("click", memoryGameBoard);
    // *****************************************************************
 
 
    // *****************************************************************
    // MOVES FUNCTION - COUNTING THE MOVES AND UPDATING THE STARS
    function gameMoves(element) {
       movesCounter.innerHTML = moves + " moves";
       if (moves == 16) {
          starsCounter.innerHTML = fullStar + fullStar + emptyStar;
       }
       if (moves == 21) {
          starsCounter.innerHTML = fullStar + emptyStar + emptyStar;
       }
    }
    // *****************************************************************
 
 
    // *****************************************************************
    // TIMER FUNCTION - TIMER FOR THE GAME THAT IS LOGGED AT THE END ON THE MODAL
    
 
    function timer() {
       if (secs < 59) {
          secs++;
          if (secs < 10) {
             secs = "0" + secs;
          }
       } else {
          secs = 0;
          mins++;
          if (mins < 10) {
             mins = "0" + mins;
          }
       }
       timerCounter.innerHTML = mins + ":" + secs;
       if (counter == iconsArray.length) {
          stopTimer();
          timeId.innerHTML = "With a time of <span class='strong'> " + mins + ":" + secs + " </span>";
       }
    }
    // STOP TIMER FUNCTION
    function stopTimer() {
       clearInterval(intervalCounter);
    }
    // *****************************************************************
 
 });