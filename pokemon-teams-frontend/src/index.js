const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

const mainEl = document.querySelector("main");
const iterateTrainers = trainers => {
  mainEl.innerText = "";
  trainers.forEach(renderTrainer);
};

const renderTrainer = trainer => {
  let cardEl = document.createElement("div");
  let nameEl = document.createElement("p");
  let addButtonEl = document.createElement("button");
  let ulEl = document.createElement("ul");
  cardEl.className = "card";
  cardEl.setAttribute("data-id", trainer.id);
  nameEl.innerText = trainer.name;
  addButtonEl.setAttribute("data-trainer-id", trainer.id);
  addButtonEl.innerText = "Add Pokemon";
  addButtonEl.addEventListener("click", () => {
    if (trainer.pokemons.length >= 6) {
      alert("Can not catch more that 6 pokemon");
    } else {
      addPokemon(trainer, ulEl);
    }
  });
  mainEl.append(cardEl);
  cardEl.append(nameEl, addButtonEl, ulEl);
  trainer.pokemons.forEach(pokemon =>
    renderPokemonList(pokemon, ulEl, trainer)
  );
};

const renderPokemonList = (pokemon, ulEl, trainer) => {
  let liEl = document.createElement("li");
  let releaseButtonEl = document.createElement("button");
  releaseButtonEl.addEventListener("click", () =>
    removePokemon(pokemon).then(data => {
      trainer.pokemons = trainer.pokemons.filter(p => p.id !== pokemon.id);
      liEl.remove();
    })
  );
  liEl.innerText = `${pokemon.nickname}(${pokemon.species})`;
  releaseButtonEl.className = "release";
  releaseButtonEl.setAttribute("data-pokemon-id", pokemon.id);
  releaseButtonEl.innerText = "Release";
  ulEl.append(liEl);
  liEl.append(releaseButtonEl);
};

const removePokemon = pokemon => {
  return fetch(`${POKEMONS_URL}/${pokemon.id}`, {
    method: "DELETE"
  }).then(res => res.json());
};

const addPokemon = (trainer, ulEl) => {
  return fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ trainer_id: trainer.id })
  })
    .then(res => res.json())
    .then(data => {
      trainer.pokemons.push(data);
      renderPokemonList(data, ulEl, trainer);
    });
};

const requestTrainers = fetch(TRAINERS_URL);
const jsonify = response => response.json();
const renderInfo = infoData => {
  iterateTrainers(infoData);
};

requestTrainers.then(jsonify).then(renderInfo);
