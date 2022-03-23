import NewGame from './_view.js';
import { selectIcons } from './_model.js';

// The amount of cards is controlled here, because it depends on the buttons pressed.

const containerOptions = document.querySelector('.container-options');
const containerTable = document.querySelector('.container-table');
const initialScreen = document.querySelector('.container-initial-screen ');
const btnStart = document.querySelector('.btn-start');
const btnTimer = document.querySelector(
  '.container-options__timer--checker-anchor'
);
const btnPlayAgain = document.querySelector('.btn-play-again');
const btnNextLevel = document.querySelector('.btn-next-level');

const dealCards = function (e) {
  let numberCards = 4;
  if (e) {
    e.preventDefault();
    if (e.target.classList.contains('btn-amount')) {
      numberCards = +e.target.dataset.btnAmount;
    }
  }

  console.log(numberCards);
  const newGame = new NewGame();
  newGame.render(selectIcons(numberCards), numberCards);

  //   containerTable: it wil contain all the selected cards. It executes #turnCard().
  //   containerTable.addEventListener('click', newGame.turnCard.bind(newGame));

  //   btnPlayAgain.addEventListener(
  //     'click',
  //     newGame.render(selectIcons(numberCards), numberCards)
  //   );

  //   btnPlayAgain.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     console.log(newGame.numberCards);
  //   });

  //   btnTimer.addEventListener('click', newGame.checked.bind(newGame));
};

const startGame = function (e) {
  e.preventDefault();
  //   setTimeout(() => {
  initialScreen.classList.add('hide');
  dealCards();
  //   }, 300);
};

btnStart.addEventListener('click', startGame);
containerOptions.addEventListener('click', dealCards);
