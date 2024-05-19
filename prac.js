function questioniterator(){
  quesIndex++;
  clearInterval(interalvar);
  if (quesIndex < result.length) {
    datahtmlpush(result[quesIndex]);
  } else {
    window.location.href = "ques.html";
  }
}

function datahtmlpush(singleres) {
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
function handleclick(optionContainer, ans) {
  const radioButton = optionContainer.querySelector("input[type='radio']");
  const selectedOption = optionContainer.querySelector("label");
  if (selectedOption) {
    const selectedValue = selectedOption.textContent.trim();
    if (selectedValue === ans) {
      optionContainer.style.backgroundColor = "lightgreen";
      radioButton.click();
      timer = 3;
    } else {
      optionContainer.style.backgroundColor = "#FFCCCB";
    }
  }
  radioButton.click();
}

let quesIndex = 0;
let result;
async function apifetch() {
    try{
        let response = await fetch(
            "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
          );
          let resjs = await response.json();
          result = resjs.results;
          if (result) {
            let singleres = result[quesIndex];
            datahtmlpush(singleres);
          }
          else{
            setTimeout(apifetch,500);
          }
          
    }
    catch(error){
        setTimeout(apifetch,500);
    }
}

apifetch();