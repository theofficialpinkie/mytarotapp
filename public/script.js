let spread = [];
let selectedIds = [];

document.getElementById("getSpreadBtn").addEventListener("click", loadSpread);
document.getElementById("getReadingBtn").addEventListener("click", getReading);

async function loadSpread() {
  const res = await fetch("/api/spread");
  const data = await res.json();
  spread = data.spread;
  selectedIds = [];
  renderSpread();
}

function renderSpread() {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";
  spread.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front" style="background-image: url('${card.image}')"></div>
      </div>
    `;
    cardDiv.onclick = () => selectCard(card.id, cardDiv);
    container.appendChild(cardDiv);
  });
}

function selectCard(id, element) {
  if (selectedIds.length >= 6 || selectedIds.includes(id)) return;
  selectedIds.push(id);
  element.classList.add("flipped");

  if (selectedIds.length === 6) {
    document.getElementById("getReadingBtn").disabled = false;
  }
}

async function getReading() {
  const question = document.getElementById("question").value;
  const res = await fetch("/api/reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, selectedIds })
  });
  const data = await res.json();
  document.getElementById("readingText").innerText = data.answer;
  document.getElementById("reading").classList.add("show");
}
