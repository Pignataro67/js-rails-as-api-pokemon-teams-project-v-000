const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const main = document.querySelector("main")

document.addEventListener("DOMContentLoaded", () => {
  
  fetchTrainers();
});

function fetchTrainers() {
  fetch(TRAINERS_URL)
  .then(response => response.json())
  .then(trainersObject => {
    for (const trainer in trainersObject) {
      if (trainersObject.hasOwnProperty(trainer)) {
        renderTrainer(trainersObject[trainer])
      }
    }
  });
}

function renderTrainer(trainer) { 
  const div = document.createElement("div")
  div.setAttribute("class", "card")
  div.setAttribute("data-id", trainer.id)
  main.appendChild(div)
  const p = document.createElement("p")
  p.innerText = trainer.name
  div.appendChild(p)
  const addPokemonBtn = document.createElement("button")
  addPokemonBtn.addEventListener("click", event => {
    addPokemon(event)
  })
  addPokemonBtn.innerText = "Add Pokemon"
  div.appendChild(addPokemonBtn)
  const ul = document.createElement("ul")
  div.appendChild(ul)
  // render each pokemon on team
  for (const pokemon in trainer.pokemons) {
    if (trainer.pokemons.hasOwnProperty(pokemon)) {
      renderPokemon(trainer.pokemons[pokemon], ul)
    }
  }
}

function renderPokemon(pokemon, ul) {
  const li = document.createElement("li")
  li.innerText = `${pokemon.nickname} (${pokemon.species})`
  const releaseBtn = document.createElement("button")
  releaseBtn.setAttribute("class", "release")
  releaseBtn.setAttribute("data-pokemon-id", pokemon.id)
  releaseBtn.addEventListener("click", releasePokemon)
  releaseBtn.innerText = "Release"
  li.appendChild(releaseBtn)
  ul.appendChild(li)
}

function addPokemon(event) {
  event.preventDefault()
  const trainerId = parseInt(event.target.parentElement.dataset.id)
  const ul = event.target.parentElement.querySelector("ul")

  if (ul.childElementCount < 6) {
    let requiredBody = {
      trainer_id : trainerId
    };

    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        
      },
      body: JSON.stringify(requiredBody)
    };

    fetch(POKEMONS_URL, configObj)
    .then(response => response.json())
    .then(object => {
      renderPokemon(object, ul)
    })
    .catch((reason) => {
      console.log(reason)
    });
  } else {
    alert("Team is full")
  }
}


function releasePokemon(event) {
  event.preventDefault(event)
  const pokemonId = parseInt(event.target.dataset.pokemonId)

  fetch(`${POKEMONS_URL}/${pokemonId}`, { method: "DELETE" })
  
  event.target.parentElement.remove()
}