backup.js;
// Function to set up canvas before getting data back form server
setupCard();

//Anonymous Function
document.addEventListener("DOMContentLoaded", function () {
  // Method
  Card.loadCards();
});

// Watches the addCard form and when it's submitted it will run the addCard function.
document.getElementById("addCardForm").addEventListener("submit", addCard);

// Constructor
class Card {
  constructor(question, answer, title, language_id) {
    this.question = question;
    this.answer = answer;
    this.title = title;
    this.language_id = language_id;
  }
  //static class level method
  static loadCards() {
    fetch("http://localhost:3000/cards")
      .then(function (response) {
        return response.json();
      })
      .then(function (cardList) {
        setupPage(cardList);
      });
  }
}

//  - take card data array, iterate through it, and put date on page.
function setupPage(cardList) {
  window.cardList = cardList;
  window.currentPage = 0;

  renderCard();
  // debugger;
}
const cardAlert = (action) => {
  let cardAlert = document.getElementById("cardAlert");
  cardAlert.setAttribute("class", "active");
  //
  cardAlert.innerHTML = `Card ${action}`;
  setTimeout(() => {
    cardAlert.classList.remove("active");
  }, 2000);
};

// Add card
function addCard() {
  event.preventDefault();

  let question = document.getElementById("addQuestion").value;
  let answer = document.getElementById("addAnswer").value;
  let title = document.getElementById("addTitle").value;
  let e = document.getElementById("language_id");
  let language_id = e.options[e.selectedIndex].id;

  let data = {
    card: {
      question,
      answer,
      title,
      language_id,
    },
  };

  console.log(data);

  console.log("hello world");

  fetch("http://localhost:3000/cards", {
    method: "POST",
    headers: {
      //check here
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    // sends HTTP request to server /cards in string format. server cant read JSON
    body: JSON.stringify(data),
  })
    // returns response object to as long string and turns it into JSON so it's more organized for browser
    .then((response) => response.json())

    .then((newCardList) => {
      console.log(newCardList);
      window.cardList = newCardList;
      window.currentPage = window.cardList.length - 1;
      renderCard();
    })
    .then(() => {
      cardAlert("added");
    });

  //
  console.log("Card Added");
  document.getElementById("addCardForm").reset();
}

// stuff that stays the same
function setupCard() {
  // added title and p tag in wrapper
  let wrapper = document.createElement("div");
  window.cardTitle = document.createElement("h3");
  window.question = document.createElement("p");
  window.answer = document.createElement("p");
  window.language = document.createElement("p");

  // Created Classes for the above elements
  // Hide Title and Answer by using 'display=none'
  wrapper.setAttribute("id", "card-item");
  window.language.setAttribute("id", "card-language");
  window.question.setAttribute("class", "card-question");
  window.cardTitle.setAttribute("class", "card-title");
  window.answer.setAttribute("class", "card-answer");

  // added title and p tag inside wrapper
  wrapper.appendChild(window.language);
  wrapper.appendChild(window.cardTitle);
  wrapper.appendChild(window.question);
  wrapper.appendChild(window.answer);

  // grabbed list we wanted to add onto
  let cardList = document.querySelector("div#card-list");

  // Clear card-list so new data creates a new list of questions and answers
  cardList.innerHTML = "";
  // takes all  cards and renders them to a wrapper named 'card-list'
  cardList.appendChild(wrapper);

  // creating button element
  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("id", "deleteButton");

  // creating text to be displayed on button
  let text = document.createTextNode("Delete This Card");

  // appending text to button
  deleteButton.appendChild(text);

  // appending button to div
  wrapper.appendChild(deleteButton);

  //   let deleteBtn = document.getElementById("deleteButton");

  deleteButton.addEventListener("click", deleteCard);
}

// stuff that changes every time the next card appears
function renderCard() {
  window.question.style.display = "block";
  window.cardTitle.style.display = "none";
  window.answer.style.display = "none";

  const card = window.cardList[window.currentPage];
  console.log(card);
  window.language.innerText = card.language;
  window.cardTitle.innerText = card.title;
  window.answer.innerText = card.answer;
  window.question.innerText = card.question;

  // creating deleteButton that appears on each card
  let cardItem = document.getElementById("card-item");
}

function nextCard() {
  // increment current page
  window.currentPage++;
  // check if current page is a page beyond page count
  if (window.currentPage >= window.cardList.length) {
    // if current page is beyond page count then set current page to 0
    window.currentPage = 0;
  }
  // add code for removing the delete button here

  // render current page

  renderCard();
}

function prevCard() {
  // decrement current page
  window.currentPage--;

  // check if current page is below 0
  if (window.currentPage <= 0) {
    // if current page is below 0, set page to cardList.length-1
    window.currentPage = window.cardList.length - 1;
  }

  // add code for removing the delete button here
  //   let removeButton = document.getElementById("deleteButton");

  renderCard();
}

function flipCard() {
  //if answer is hidden
  if (window.answer.style.display == "none") {
    // hide question
    window.question.style.display = "none";
    // reveal answer
    window.answer.style.display = "block";
    // reveal and title
    window.cardTitle.style.display = "block";
  } else {
    // show question
    window.question.style.display = "block";
    // hide answer
    window.answer.style.display = "none";
    // hide title
    window.cardTitle.style.display = "none";
  }
}

// Prevent Empty form from being submitted - Not working.
function empty() {
  let x;
  x = document.getElementById("addQuestion").value;
  if (x == "") {
    alert("Enter a Valid Roll Number");
    return false;
  }
}

// Delete a card function and.

function deleteCard(event) {
  const card = window.cardList[window.currentPage];
  console.log("i clicked", card);

  deleteButton = document.getElementById("deleteButton");

  deleteFetch(card.id);

  cardAlert("Deleted");
}

function deleteFetch(id) {
  fetch(`http://localhost:3000/cards/${id}`, {
    method: "DELETE",
    mode: "cors",
  })
    .then((response) => response.json())
    .then((newCardList) => {
      window.cardList = newCardList;
      prevCard();
      //   console.log(deleteResponse);
    });
}
