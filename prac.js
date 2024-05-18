

async function apifetch() {
    try{
        let response = await fetch(
            "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
          );
          let resjs = await response.json();
          let result = resjs.results;
          let quesIndex = 0;
          if (result) {
            let singleres = result[quesIndex];
            datahtmlpush(singleres);
          }
          else{
            setTimeout(apifetch,500);
          }
          function questioniterator() {
            quesIndex++;
            if (quesIndex < result.length) {
              datahtmlpush(result[quesIndex]);
            } else {
              window.location.href = "ques.html";
            }
          }
          
          function datahtmlpush(singleres) {
            let ques = `${singleres.question}`;
            let opt = "";
            singleres.incorrect_answers.forEach((op) => {
              opt += `<div class="int">
                <input type="radio"  name="options">
                <label for="${op}">${op}</label>
            </div>`;
            });
            opt += `<div class="int">
            <input type="radio"  name="options">
            <label for="${singleres.correct_answer}">${singleres.correct_answer}</label>
        </div>`;
            document.querySelector(".ext1").innerHTML = ques;
            document.querySelector(".ext2").innerHTML = opt;
            startTimer();
          }
        
          async function startTimer() {
            let timer = 30;
            let documentele = document.querySelector(".timer");
            documentele.innerHTML = timer;
            let interalvar = setInterval(countdowntime, 1000);
            function countdowntime() {
              timer--;
              documentele.innerHTML = timer;
              if (timer == 0) {
                clearInterval(interalvar);
                questioniterator();
              }
            }
          }
    }
    catch(error){
        setTimeout(apifetch,500);
    }
}
apifetch();



