'use strict';

import { allIcons } from './Scripts/variables.js';

const initialScreen = document.querySelector('.container-initial-screen ');
const btnStart = document.querySelector('.btn-start');
const containerOptions = document.querySelector('.container-options');
const containerTable = document.querySelector('.container-table');
const containerPopUp = document.querySelector('.container-popups');
const winMessage = document.querySelector('.container-popups__win-message');
const scoreDisplay = document.querySelector(
  '.container-options__score--counter'
);
const allButtonsAmount = document.querySelectorAll('.btn-amount');

const possibleAmountCards = [12, 20, 28, 40];

const timerTimePerLevel = {
  12: 60,
  20: 120,
  28: 180,
  40: 240,
};

let iconsSelected;
let numberCards = 12;
let scoreCounter = 0;
let openCards = [];
let allMatchedCards = [];
let timer;

// FUNCTIONS------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const timeout = seconds => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
};

// SHUFFLE AND SELECT GAME CARDS ----------------------------------------
const shuffleAllIcons = function (icons) {
  for (let i = icons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = icons[i];
    icons[i] = icons[j];
    icons[j] = temp;
  }
  return icons;
};

const selectIcons = function (icons, amount) {
  const finalSel = icons.slice(0, amount);
  const iconsDuplicated = finalSel
    .concat(finalSel)
    .sort(() => (Math.random() > 0.5 ? 1 : -1));
  return iconsDuplicated;
};

const createHTML = function (numCards) {
  const table = document.createElement('div');
  table.classList.add('container-table__frame');
  table.classList.add(`container-table__frame--${numCards}-cards`);

  iconsSelected = selectIcons(shuffleAllIcons(allIcons), numCards / 2);

  iconsSelected.forEach(icon => {
    const html = `<div class="card">
     <div class="card__side card__side--front"></div>
     <div class="card__side card__side--back">
     ${icon}
     </div>
     </div>`;
    table.insertAdjacentHTML('beforeend', html);
  });
  containerTable.innerHTML = '';
  containerTable.insertAdjacentElement('afterbegin', table);
};

// START GAME -------------------------------------------------

const emptyArraysCards = () => {
  allMatchedCards = [];
  iconsSelected = [];
  openCards = [];
};

const pressAmountBtnEffect = button => {
  allButtonsAmount.forEach(btn => {
    btn.style.border = '1px solid #777';
    btn.style.color = '#777';
    btn.style.transform = 'scale(1);';
  });
  button.style.border = '2px solid #fff';
  button.style.color = '#fff';
  button.style.transform = 'scale(1.1);';
};

const dealCards = function (e) {
  emptyArraysCards();
  containerTable.style.pointerEvents = 'auto';

  console.log(numberCards);
  if (this === btnStart) initialScreen.classList.add('hide');
  const buttonHighlighted = Array.from(allButtonsAmount).find(el =>
    el.classList.contains(`btn-${numberCards}`)
  );
  console.log(buttonHighlighted);

  if (e) {
    e.preventDefault();
    if (e.target.classList.contains('btn-amount')) {
      openCards = [];
      numberCards = +e.target.dataset.btnAmount;
      pressAmountBtnEffect(e.target);

      // setTimeout: to prevent a delay that left the timer in red.
      setTimeout(() => {
        timer && turnOffTimer();
      }, 900);
    }

    //  if: it prevents the timer button from trigger the dealGame func.
    if (e.target.classList.contains('container-options__timer--button-anchor'))
      return;
  }

  createHTML(numberCards);
};

// TURN CARDS ---------------------------------------------------
const rotateCard = (element, degrees) =>
  (element.style.transform = `rotateY(${degrees}deg)`);

const vanishCard = card => {
  card.card.style.opacity = 0; // this vanishes the back
  card.card.previousElementSibling.style.opacity = 0; // this vanishes front
};

const displayPopUp = containerMessage => {
  [containerPopUp, containerMessage].forEach(elem =>
    elem.classList.toggle('hide')
  );
};

const displayScore = () =>
  (scoreDisplay.innerHTML = String(scoreCounter).padStart(2, 0));

const matchCards = function () {
  // if: logic for two cards that match
  if (openCards[0].id === openCards[1].id) {
    allMatchedCards.push(openCards[0].id);
    allMatchedCards.push(openCards[1].id);

    timeout(1.6).then(() => {
      vanishCard(openCards[0]);
      vanishCard(openCards[1]);
      // ternary-op: when timer is on, 2 points per cards marched
      timer ? (scoreCounter += 2) : scoreCounter++;
      displayScore();
      openCards = [];
    });

    //  if: logic when all cards are uncovered (winning a game).
    if (allMatchedCards.length === iconsSelected.length) {
      // short-circ: stops the timer
      timer && clearInterval(timer);

      timeout(2.5).then(() => {
        // if: Hides the "next-level" btn if the 40 card level was completed.
        if (
          numberCards === possibleAmountCards[possibleAmountCards.indexOf(40)]
        ) {
          document.querySelector('.btn-next-level').classList.add('hide');
          document.querySelector(
            '.container-popups__win-message--text'
          ).textContent =
            'Congratulations!!! You have completed the highest level';
        }

        displayPopUp(winMessage);
      });
    }
    return;
  }

  //   func: turns cards back down if they dont match
  timeout(1.7).then(() => {
    rotateCard(openCards[0].card, 180);
    rotateCard(openCards[0].card.previousElementSibling, 0);
    rotateCard(openCards[1].card, 180);
    rotateCard(openCards[1].card.previousElementSibling, 0);
    openCards = [];
  });
};

const turnCard = function (e) {
  if (e.target.classList.contains('card__side') && openCards.length < 2) {
    const frontCard = e.target;
    const backCard = frontCard.nextElementSibling;
    const iconID = backCard.querySelector('.fas').dataset.id;
    openCards.push({
      card: backCard,
      id: iconID,
    });

    rotateCard(frontCard, -180);
    rotateCard(backCard, 0);
    openCards[1] && matchCards();
  }
};

// POP-UPS-------------------------------------------

// func: logic for winning popup buttons
const winPopUpButtonsHandler = function (e) {
  e.preventDefault();
  if (e.target.classList.contains('btn-play-again')) {
    displayPopUp(winMessage);
    timer && turnOffTimer();
    dealCards();
  }
  if (e.target.classList.contains('btn-next-level')) {
    displayPopUp(winMessage);

    timer && turnOffTimer();

    //  if:  this is for setting the amount of cards for next level. 40 is top.
    if (numberCards !== possibleAmountCards[possibleAmountCards.indexOf(40)]) {
      numberCards =
        possibleAmountCards[possibleAmountCards.indexOf(numberCards) + 1];
    }
    dealCards();

    const currentBtnAmount = Array.from(allButtonsAmount).find(btn =>
      btn.classList.contains(`btn-${numberCards}`)
    );
    //  Func: it is for highlighting the btn-amount for the next game
    pressAmountBtnEffect(currentBtnAmount);
  }
};

// EVENT LISTENERS -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
btnStart.addEventListener('click', dealCards);
containerOptions.addEventListener('click', dealCards);
containerTable.addEventListener('click', turnCard);
winMessage.addEventListener('click', winPopUpButtonsHandler);

// timer ------------------------------------------------------------------------------------------------------------------------------
// Elements timer container
const containerTimer = document.querySelector('.container-options__timer');
const btnTimer = document.querySelector(
  '.container-options__timer--button-anchor'
);
const timeDisplayMinutes = document.querySelector(
  '.container-options__timer--minutes'
);
const timeDisplayColon = document.querySelector(
  '.container-options__timer--colon'
);
const timeDisplaySeconds = document.querySelector(
  '.container-options__timer--seconds'
);

const timerMessage = document.querySelector('.container-popups__timer-message');
const timerBtnText = document.querySelector('.timer--button-name');

// Elements time´s up popup
const timesUpMessage = document.querySelector(
  '.container-popups__timesUp-message'
);

// functions -----------------------------

// func: to setup the colors (red and white) when time is running out.
const redWhiteColorFlasher = () => {
  timeDisplayMinutes.classList.toggle('text-timer-red');
  timeDisplayColon.classList.toggle('text-timer-red');
  timeDisplaySeconds.classList.toggle('text-timer-red');
  timerBtnText.classList.toggle('text-timer-red');
  containerTimer.classList.toggle('box-timer-red');
  btnTimer.classList.toggle('button-timer-on');
  btnTimer.classList.toggle('button-timer-red');
};

// func: when time is runing out, this func is called each second.
const timeRunningOut = (min, sec) => {
  redWhiteColorFlasher();

  //func: the red flash duration. NOT the interval but the flash itself.
  timeout(0.65).then(() => {
    redWhiteColorFlasher();

    //if: when time´s up it leaves the timer in red
    if (min === '00' && sec === '00') {
      // timerBtnText.textContent = "time's up!!";
      redWhiteColorFlasher();
    }
  });
};

const countDown = function (seconds) {
  const tick = () => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    time--;
    timeDisplayMinutes.textContent = `${min}`;
    timeDisplaySeconds.textContent = `${sec}`;

    //  if: logic when time starts to run out.
    if (min === '00' && +sec <= 5) {
      timeRunningOut(min, sec);
      // style: prevents the timer button from being pressed
      btnTimer.style.pointerEvents = 'none';
    }

    //  if: logic when time´s up
    if (time < 0) {
      containerTable.style.pointerEvents = 'none';

      clearInterval(timer);
      timeout(0.6).then(() => displayPopUp(timesUpMessage));
    }
  };

  let time = seconds;

  if (!timer) {
    timer = setInterval(tick, 1000);
  }
  // tick(): is called to avoid 1 second delay.
  tick();
};

// func: sets the colors of the timer (grey or white)
const setTimerColor = txtContent => {
  containerTimer.classList.remove('box-timer-red');
  btnTimer.classList.remove('button-timer-red');

  txtContent === 'timer off'
    ? btnTimer.classList.remove('button-timer-on')
    : btnTimer.classList.add('button-timer-on');

  timerBtnText.textContent = txtContent;

  [
    timerBtnText,
    timeDisplayMinutes,
    timeDisplaySeconds,
    timeDisplayColon,
  ].forEach(el => {
    el.classList.remove('text-timer-red');
  });
  [
    timerBtnText,
    timeDisplayMinutes,
    timeDisplayColon,
    timeDisplaySeconds,
  ].forEach(el => {
    el.classList.toggle('text-timer-on');
  });
};

const turnOffTimer = () => {
  setTimerColor('timer off');
  clearInterval(timer);
  timer = null;
  btnTimer.style.pointerEvents = 'auto';
  timeDisplayMinutes.textContent = '00';
  timeDisplaySeconds.textContent = '00';
};

const turnOnTimer = function (e) {
  e.preventDefault();

  //   if: it displays the popup only if timer is off.
  if (!this.classList.contains('button-timer-on')) {
    displayPopUp(timerMessage);
    return;
  }
  //   func: if the timer is already on, it turns it off.
  turnOffTimer();
};

// func: logic for timer pop-up buttons.
const timerPopUpButtonsHandler = function (e) {
  e.preventDefault();

  if (e.target.classList.contains('btn-continue')) {
    displayPopUp(timerMessage);
    setTimerColor('timer on');
    countDown(timerTimePerLevel[numberCards]);
    dealCards();
  }
  if (e.target.classList.contains('btn-cancel')) {
    displayPopUp(timerMessage);
    return;
  }
};

const timesUpPopUpButtonsHandler = function (e) {
  e.preventDefault();
  if (e.target.classList.contains('btn-restart')) {
    displayPopUp(timesUpMessage);
    turnOffTimer();
    scoreCounter = 0;
    displayScore();
    dealCards();
  }
  if (e.target.classList.contains('btn-exit')) {
    initialScreen.classList.remove('hide');
    turnOffTimer();
    displayPopUp(timesUpMessage);
    scoreCounter = 0;
    displayScore();
  }
};

btnTimer.addEventListener('click', turnOnTimer);
timerMessage.addEventListener('click', timerPopUpButtonsHandler);
timesUpMessage.addEventListener('click', timesUpPopUpButtonsHandler);

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Improvements: -------------------

// 1. The popup for level finished should display the score.
// 2. Store in the browser the highest score so the player can try to improve it.

// options to load cards based on different topics.
//  Language
