const animalsContainer = document.getElementById('animalsContainer');
const pauseBtn = document.getElementById('pauseBtn');
let paused = false;

const NUM_ANIMALS = 12;
const MIN_DECAY_RATE = 0.5;
const MAX_DECAY_RATE = 2.0;

const animals = [];

function randomStartValue() {
  return 30 + Math.random() * 50;
}

function randomDecay() {
  return MIN_DECAY_RATE + Math.random() * (MAX_DECAY_RATE - MIN_DECAY_RATE);
}

function createAnimalElement(name, index) {
  const animalDiv = document.createElement('div');
  animalDiv.className = 'animal';
  animalDiv.dataset.index = index;

  animalDiv.innerHTML = `
    <h3>${name}</h3>
    <label for="voeden-${index}">Voeden</label>
    <progress id="voeden-${index}" max="100" value="0"></progress>
    <label for="drinken-${index}">Drinken</label>
    <progress id="drinken-${index}" max="100" value="0"></progress>
    <label for="slapen-${index}">Slapen</label>
    <progress id="slapen-${index}" max="100" value="0"></progress>
    <div class="status" style="font-weight:bold; color:#b22222;"></div>
  `;

  return animalDiv;
}

// Setup animals
for (let i = 0; i < NUM_ANIMALS; i++) {
  const name = `Dier ${i + 1}`;
  const el = createAnimalElement(name, i);
  animalsContainer.appendChild(el);

  animals.push({
    el,
    voeden: randomStartValue(),
    drinken: randomStartValue(),
    slapen: randomStartValue(),
    decayVoeden: randomDecay(),
    decayDrinken: randomDecay(),
    decaySlapen: randomDecay(),
    alive: true
  });
}

function updateBars(animal) {
  const { el, voeden, drinken, slapen } = animal;
  el.querySelector(`#voeden-${el.dataset.index}`).value = voeden;
  el.querySelector(`#drinken-${el.dataset.index}`).value = drinken;
  el.querySelector(`#slapen-${el.dataset.index}`).value = slapen;
}

function checkDeath(animal) {
  if (animal.alive && (animal.voeden <= 0 || animal.drinken <= 0 || animal.slapen <= 0)) {
    animal.alive = false;
    animal.voeden = 0;
    animal.drinken = 0;
    animal.slapen = 0;
    animal.el.classList.add('dead');
    animal.el.querySelector('.status').textContent = 'Dood 💀';
  }
}

// Klik event om waarden te verhogen
animals.forEach((animal, idx) => {
  ['voeden', 'drinken', 'slapen'].forEach(stat => {
    const prog = animal.el.querySelector(`#${stat}-${idx}`);
    prog.addEventListener('click', () => {
      if (paused) return;
      if (!animal.alive) return;
      animal[stat] = Math.min(100, animal[stat] + 10);
      updateBars(animal);
      animal.el.querySelector('.status').textContent = '';
    });
  });
});

// Update loop (1x per seconde)
function update() {
  if (paused) return;

  animals.forEach(animal => {
    if (!animal.alive) return;

    animal.voeden -= animal.decayVoeden;
    animal.drinken -= animal.decayDrinken;
    animal.slapen -= animal.decaySlapen;

    animal.voeden = Math.max(0, animal.voeden);
    animal.drinken = Math.max(0, animal.drinken);
    animal.slapen = Math.max(0, animal.slapen);

    checkDeath(animal);
    updateBars(animal);
  });
}

setInterval(update, 1000);

// Pauzeerknop event
pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? '▶️ Hervatten' : '⏸ Pauzeer';
});
