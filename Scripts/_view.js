export default class NewGame {
  #containerTable = document.querySelector('.container-table');
  #table = document.createElement('div');
  possibleAmountCards = [12, 20, 28, 40];
  numberCards;
  #iconsSelected;

  render(iconsSelected, numCards = this.numberCards) {
    this.addEvent();
    this.numberCards = numCards;
    this.#iconsSelected = iconsSelected;
    this.#table.classList.add('container-table__frame');
    this.#table.classList.add(
      `container-table__frame--${this.numberCards}-cards`
    );

    this.#createHTML2();
    this.#containerTable.innerHTML = '';
    this.#containerTable.insertAdjacentElement('afterbegin', this.#table);
  }

  #createHTML2() {
    this.#iconsSelected.forEach(icon => {
      const html = `<div class="card">
     <div class="card__side card__side--front"></div>
     <div class="card__side card__side--back">
     ${icon}
     </div>
     </div>`;
      this.#table.insertAdjacentHTML('beforeend', html);
    });
  }

  // TURN CARD -----------------------------------------------------------------------------------------------------------------------------
  #openCards = [];
  #allMatchedCards = [];
  #containerPopUp = document.querySelector('.container-popups');
  #winMessage = document.querySelector('.container-popups__win-message');

  #timeout(seconds) {
    return new Promise(resolve => {
      setTimeout(resolve, seconds * 1000);
    });
  }

  #rotateCard(element, degrees) {
    element.style.transform = `rotateY(${degrees}deg)`;
  }

  //   #vanishCards(): when there is a match, this func vanishes 1 card. This is called twice on #matchCards().
  #vanishCards(card) {
    card.card.style.opacity = 0; // this vanishes the back
    card.card.previousElementSibling.style.opacity = 0; // this vanishes front
  }

  #matchCards() {
    if (this.#openCards[0].id === this.#openCards[1].id) {
      this.#allMatchedCards.push(this.#openCards[0].id);
      this.#allMatchedCards.push(this.#openCards[1].id);

      this.#timeout(1.6).then(() => {
        this.#vanishCards(this.#openCards[0]);
        this.#vanishCards(this.#openCards[1]);
        this.#openCards = [];
      });

      // if: this shows the win popup is all cards have vanished
      if (this.#allMatchedCards.length === this.#iconsSelected.length) {
        console.log(this.#allMatchedCards);
        console.log(this.#iconsSelected);
        this.#timeout(2.7).then(() => {
          [this.#containerPopUp, this.#winMessage].forEach(elem => {
            elem.classList.remove('hide');
          });
        });
        //   this.#allMatchedCards = [];
        //   this.#iconsSelected = [];
        console.log(this.numberCards);
      }
      return;
    }

    //  timeout(): this turns the 2 cards back down if there is NO match
    this.#timeout(1.7).then(() => {
      this.#rotateCard(this.#openCards[0].card, 180);
      this.#rotateCard(this.#openCards[0].card.previousElementSibling, 0);
      this.#rotateCard(this.#openCards[1].card, 180);
      this.#rotateCard(this.#openCards[1].card.previousElementSibling, 0);
      this.#openCards = [];
    });
  }

  turnCard(e) {
    if (
      e.target.classList.contains('card__side') &&
      this.#openCards.length < 2
    ) {
      const frontCard = e.target;
      const backCard = frontCard.nextElementSibling;
      const iconID = backCard.querySelector('.fas').dataset.id;
      this.#openCards.push({
        card: backCard,
        id: iconID,
      });

      this.#rotateCard(frontCard, -180);
      this.#rotateCard(backCard, 0);
      console.log(this.#iconsSelected);
      console.log(this.numberCards);
      // console.log(this.#allMatchedCards);

      this.#openCards[1] && this.#matchCards();
    }
  }

  addEvent() {
    containerTable.addEventListener('click', this.turnCard);
  }

  //   TIMER ------------------------------------------------------------------------------------------------------------------

  #timeDisplay = document.querySelector('.container-options__timer--time');
  #textTimer = document.querySelector(
    '.container-options__timer--checker-name'
  );
  #timerOn = false;

  #countDown(seconds) {
    const tick = () => {
      const min = String(Math.floor(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      time--;
      // this.#timerOn === true && clearInterval(timer);
      time === 0 && clearInterval(timer);

      this.#timeDisplay.textContent = `${min}:${sec}`;
    };
    let time = seconds;

    const timer = setInterval(tick, 1000);
    //  tick();
  }

  checked(e) {
    e.preventDefault();

    //  if (!e.target.classList.contains('checked')) {
    e.target.classList.toggle('checked');
    // console.log('no tiene checked y se le va a añadir');
    // e.target.classList.add('checked');
    this.#timerOn = true;
    this.#countDown(10);
    //  }

    // return;
    //  need to stop countDown
  }
}
