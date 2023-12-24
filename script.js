document.addEventListener("keydown", handleKeyPress);
let chosen_word = possible_answers[Math.floor(Math.random() * possible_answers.length)];
let currentRow = 0;

function resetGame() {
  let allLetters = document.querySelectorAll('.letter');
  allLetters.forEach(elm => {
    elm.textContent = "";
    elm.classList.remove(...elm.classList);
    elm.classList.add("letter");
  });

  chosen_word = possible_answers[Math.floor(Math.random() * possible_answers.length)];
  currentRow = 0;

  console.log(currentRow);
  document.getElementById("newGameBtn").blur();
}

function gameEnd(state) {
  // Get the modal
  var modal = document.getElementById("word-info");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  document.getElementById("result").textContent = "You " + state + "!";
  if (state == 'lose') {
    document.getElementsByClassName("modal-header")[0].style.backgroundColor = 'salmon';
  }
  document.getElementById("word").textContent = chosen_word.toUpperCase();

  addDefinitions(chosen_word)
  .then(function(result) {
    for (let i = 0; i < result.length; i++) {
      let def = document.createElement("div");
      def.className = "def-container"
      let partOfSpeech = document.createElement("h4");
      partOfSpeech.className = "partOfSpeech";
      partOfSpeech.textContent = result[i].partOfSpeech;
      def.appendChild(partOfSpeech);
      let defContent = document.createElement("ol");
      for (let j = 0; j < Math.min(result[i].definitions.length, 4); j++) {
        let definition = document.createElement("li");
        definition.className = "definition";
        definition.textContent = result[i].definitions[j].definition;
        defContent.appendChild(definition);
      }

      def.appendChild(defContent);
      document.getElementById("definitions").appendChild(def);
    }
  })
  .catch((e) => console.log(e));
}

function handleWord() {
  let letterContainers = document.querySelectorAll(".word-container")[currentRow].querySelectorAll(".letter");

  let word = "";
  for (let i = 0; i < letterContainers.length; i++) {
    word += letterContainers[i].textContent;
  }

  word = word.toLowerCase();

  if (chosen_word === word) {
    updateInfo();
    gameEnd('win');
    return;
  }

  if (legal_words.includes(word)) {
    updateInfo();
    currentRow++;
  } else {
    alert("That word isn't in our dictionary!");
    for (let i = 0; i < letterContainers.length; i++) {
      letterContainers[i].textContent = "";
    }
  }

  if (currentRow > 5) {
    gameEnd('lose');
  }
}

function updateInfo() {
  let letterContainers = document.querySelectorAll(".word-container")[currentRow].querySelectorAll(".letter");
  let letters = [...letterContainers].map(elm => elm.textContent.toLowerCase());

  let remainingLettersInWord = chosen_word;

  for (let i = 0; i < 5; i++) {
    if (letters[i] === chosen_word[i]) {
      remainingLettersInWord = remainingLettersInWord.replace(letters[i], '');
      letterContainers[i].classList.add("correct");
    } else {
      letterContainers[i].classList.add("incorrect");
    }
  }

  for (let i = 0; i < 5; i++) {
    if (remainingLettersInWord.includes(letters[i]) && letters[i] !== chosen_word[i]) {
      remainingLettersInWord = remainingLettersInWord.replace(letters[i], '');
      letterContainers[i].classList.add("present");
    }
  }
}

function handleKeyPress(event) {
  if (currentRow > 5) return;

  if (event.key == "Backspace") {
    const letterContainers = document.querySelectorAll(".word-container")[currentRow].querySelectorAll(".letter");

    for (let i = letterContainers.length - 1; i >= 0; i--) {
      if (letterContainers[i].textContent != "") {
        letterContainers[i].textContent = "";
        break;
      }
    }
  }

  if (event.key == "Enter") {
    const letterContainers = document.querySelectorAll(".word-container")[currentRow].querySelectorAll(".letter");

    for (let i = 0; i < letterContainers.length; i++) {
      if (letterContainers[i].textContent == "") {
        return;
      }
    }

    handleWord();
    return;
  }

  const validLetters = /^[a-zA-Z]$/;
  if (validLetters.test(event.key)) {
    const letterContainers = document.querySelectorAll(".word-container")[currentRow].querySelectorAll(".letter");
    for (let i = 0; i < letterContainers.length; i++) {
      if (letterContainers[i].textContent === "") {
        letterContainers[i].textContent = event.key.toUpperCase();
        break;
      }
    }
  }
}

async function addDefinitions(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  const wordInfo = await response.json();
  
  return wordInfo[0].meanings;
}