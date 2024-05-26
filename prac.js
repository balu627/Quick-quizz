function questioniterator() {
  quesIndex++;
  clearInterval(interalvar);
  if (quesIndex < result.length) {
    datahtmlpush(result[quesIndex]);
  } else {
    sessionStorage.setItem("score", JSON.stringify([score, result.length]));
    window.location.href = "ques.html";
  }
}

function datahtmlpush(singleres) {
  let inpvalues = JSON.parse(sessionStorage.getItem("inputvalues"));
  let username = inpvalues[0];
  document.querySelector(".username").innerHTML=`<h2>Username:<i>${inpvalues[0]}</i></hr2>`
  let ques = `${singleres.question}`;
  let opt = "";
  let ans = singleres.correct_answer;
  singleres.incorrect_answers.forEach((op) => {
    opt += `<div class="int" onclick="handleclick(this,'${ans}')">
      <input type="radio"  name="options">
      <label for="${op}">${op}</label>
  </div>`;
  });
  opt += `<div class="int" onclick="handleclick(this,'${ans}')">
  <input type="radio"  name="options">
  <label for="${singleres.correct_answer}">${singleres.correct_answer}</label>
</div>`;
  document.querySelector(".ext1").innerHTML = ques;
  document.querySelector(".ext2").innerHTML = opt;
  startTimer();
}

let interalvar;
let timer;
async function startTimer() {
  timer = 30;
  let documentele = document.querySelector(".timer");
  documentele.innerHTML = timer;
  interalvar = setInterval(countdowntime, 1000);
  function countdowntime() {
    timer--;
    documentele.innerHTML = timer;
    if (timer == 0) {
      questioniterator();
    }
  }
}

var score = 0;
function handleclick(optionContainer, ans) {
  const selectedOption = optionContainer.querySelector("label");
  if (optionContainer.clicked === "true") {
    return;
  }
  if (selectedOption) {
    const selectedValue = selectedOption.textContent.trim();
    if (selectedValue === ans) {
      optionContainer.style.backgroundColor = "lightgreen";
      score++;
      timer = 3;
    } else {
      optionContainer.style.backgroundColor = "#FFCCCB";
    }
  }
  optionContainer.clicked = "true";
}

function displayScore() {
  let bothvalues = JSON.parse(sessionStorage.getItem("score"));
  let score = bothvalues[0];
  let total = bothvalues[1];
  let finalscore = score + "/" + total;
  document.querySelector(".score").textContent = finalscore;
}

let quesIndex = 0;
let result;
async function apifetch() {
  if (window.location.href.endsWith("dash.html")) {
    let loaddiv = document.querySelector(".loader");
    let inputValues = JSON.parse(sessionStorage.getItem("inputvalues"));
    console.log(inputValues);
    try {
      let response = await fetch(
        "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
      );
      let resjs = await response.json();
      result = resjs.results;
      if (result) {
        loaddiv.classList.remove("loader");
        document.querySelector(".uname").classList.add("username");
        loaddiv.classList.add("bodyctr");
        let singleres = result[quesIndex];
        datahtmlpush(singleres);
      } else {
        setTimeout(apifetch, 500);
      }
    } catch (error) {
      setTimeout(apifetch, 500);
    }
  }
}

function inputstore() {
  let userName = document.getElementById("username").value;
  let userPass = document.getElementById("password").value;
  sessionStorage.setItem("inputvalues", JSON.stringify([userName, userPass]));
}

function pageredirect() {
  if (window.location.href.endsWith("dash.html")) {
    apifetch();
  }
  if (window.location.href.endsWith("ques.html")) {
    displayScore();
  }
}

pageredirect();

const hamburger = document.querySelector(".logo");
const navmenu = document.querySelector(".right");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navmenu.classList.toggle("active");
});

document.querySelectorAll(".right").forEach(n =>{
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navmenu.classList.remove("active");
  });
});
