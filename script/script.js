const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") //promise of res
    .then((res) => res.json()) //promise of data
    .then((data) => displayLessons(data.data));
};

const displayLessons = (lessons) => {
  // 1.get the parent element
  const LessonsParent = document.getElementById("lessons-container");
  LessonsParent.innerHTML = "";

  // 2.get each lessons
  for (let lesson of lessons) {
    const levelELement = document.createElement("div");
    levelELement.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}"
        onclick="loadLevelWord(${lesson.level_no})" 
        class="btn btn-outline btn-primary lesson-btns" href="">
            <i class="fa-solid fa-book-open"></i> Lesson- ${lesson.level_no}
        </button>
        `;
    LessonsParent.appendChild(levelELement);
  }
};
loadLessons();

const removeActive = () => {
  const allLessonBtn = document.querySelectorAll(".lesson-btns");
  allLessonBtn.forEach((btn) => btn.classList.remove("active-lesson"));
  // console.log(allLessonBtn)
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const clickedBtn = document.getElementById(`lesson-btn-${id}`);
      removeActive();
      clickedBtn.classList.add("active-lesson");
      displayLevelWord(data.data);
    });
};

const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayDetails(details.data);
};

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const synonymsFunc = (arr) => {
  const htmlELements = arr.map((el) => `<span>${el}</span>`);
  return htmlELements.join(",");
};

// {
//     "word": "Cautious",
//     "meaning": "সতর্ক",
//     "pronunciation": "কশাস",
//     "level": 2,
//     "sentence": "Be cautious while crossing the road.",
//     "points": 2,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "careful",
//         "alert",
//         "watchful"
//     ],
//     "id": 3
// }

const displayDetails = (word) => {
  const detailsBox = document.getElementById("details-box");
  detailsBox.innerHTML = `
        <div  class="space-y-3">
          <div class="space-y-1">
            <h2 class="text-3xl"> ${
              word.word
            } ( <i class="fa-solid fa-microphone-lines"></i> :${
    word.pronunciation
  })</h2>
            <p class="font-bold">meaning</p>
            <p class="font-medium">${word.meaning}</p>
          </div>
          <div class="space-y-1">
            <h2 class="font-bold">Example</h2>
            <p class="font-medium">${word.sentence}</p>
          </div>
          <div class="space-y-2">
            <h2 class="font-bold">synonymous</h2>
            <div>
            ${synonymsFunc(word.synonyms)}
            </div>
          </div>
        </div>
    `;
  console.log(word);

  document.getElementById("word-details-modal").showModal();
};

const displayLevelWord = (words) => {
  // 1.get the parent and make it empty
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = ``;
  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div class="font-bangla text-center col-span-full space-y-4">
      <img class="mx-auto" src="./assets/alert-error.png" alt="">
      <p class="font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h2 class="text-4xl font-bold">নেক্সট Lesson এ যান</h2>
    </div>
    `;
    manageSpinner(false);
    return;
  }
  // 2.get each word
  words.forEach((word) => {
    const wordElement = document.createElement("div");
    wordElement.innerHTML = ` 
        <div class="col-span-1 bg-white px-10 py-8 text-center rounded-xl shadow-sm space-y-3 min-h-full">
        <h2 class="text-xl font-semibold">${
          word.word ? word.word : "শব্দ পাওয়া যায়নি"
        }</h2>
        <h4 class="font-medium">Meaning / pronunciation</h4>
        <h2 class="font-bangla font-medium text-xl">"${
          word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
        } / ${
      word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি।"
    }"</h2>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetails(${
            word.id
          })" class="btn bg-[#1a90ff19] hover:bg-[#1a90ff29]">
            <i class="fa-solid fa-circle-info"> </i>
          </button>
          <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1a90ff19] hover:bg-[#1a90ff29]">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
        `;
    wordContainer.appendChild(wordElement);
    manageSpinner(false);
  });
};

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive()
  const searchValue = document.getElementById("input-search");
  const valueToSearch = searchValue.value.trim().toLowerCase();
  console.log(valueToSearch);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      // console.log(allWords)
      const filteredWord = allWords.filter( word => word.word.toLowerCase().includes(valueToSearch))
      displayLevelWord(filteredWord)
    });
});

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
