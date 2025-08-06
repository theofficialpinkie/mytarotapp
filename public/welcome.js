const cardScroll = document.querySelector(".card-scroll");
const cards = [
  "the-fool.png", "the-magician.png", "the-high-priestess.png", 
  // ... add all cards
];

function loadCards() {
  cardScroll.innerHTML = "";
  for (let i = 0; i < cards.length; i++) {
    const img = document.createElement("img");
    img.src = `/assets/cards/${cards[i]}`;
    img.classList.add("tarot-card");
    cardScroll.appendChild(img);
  }
}
loadCards();