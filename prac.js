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
  document.querySelector(
    ".username"
  ).innerHTML = `<h2>Username:<i>${inpvalues[0]}</i></hr2>`;
  let ques = `${singleres.question}`;
  let alloptions = [
    singleres.option1,
    singleres.option2,
    singleres.option3,
    singleres.correct_answer,
  ];
  for (let i = alloptions.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [alloptions[i], alloptions[j]] = [alloptions[j], alloptions[i]];
  }
  let opt = "";
  let ans = singleres.correct_answer;
  alloptions.forEach((op) => {
    opt += `<div class="int" onclick="handleclick(this,'${ans}')">
      <input type="radio"  name="options">
      <label for="${op}">${op}</label>
  </div>`;
  });
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
      let response = await fetch("http://127.0.0.1:8000/fetch");
      result = await response.json();
      console.log(result);
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
      console.log(error);
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

document.querySelectorAll(".right").forEach((n) => {
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navmenu.classList.remove("active");
  });
});



function addquestiontodb() {
  // Retrieve user input values
  const questions = [];
  document.querySelectorAll('.eachquestioninp').forEach(function (questionInput) {
    const question = questionInput.querySelector('.questioninpt').value;
    const options = [];
    questionInput.querySelectorAll('.eachoptioninp').forEach(function (optionInput) {
      options.push(optionInput.value);
    });
    const correctOption = options.pop(); // Remove and store the correct option from options array
    questions.push({ question, options, correctOption });
  });

  // Prepare data to send to the server
  const data = {
    questions: questions
  };

  // Send data to the server using fetch
  fetch('http://127.0.0.1:8000/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      console.log('Questions added successfully');
      // Redirect or display success message as needed
    } else {
      console.error('Failed to add questions');
      // Handle error
    }
  })
  .catch(error => {
    console.error('Error adding questions:', error);
    // Handle error
  });
}
