// async function fetchapi() {
//     try{
//         let res = await fetch(
//             "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
//           );
//           let resjs = await res.json();
//           let result = resjs.results;
//           if (result) {
//             for (let i = 0; i < result.length; i++) {
//               document.addEventListener("DOMContentLoaded", function() {
//                 let time = 30;
//                 const countdownEle = document.querySelector(".timer");
            
//                 let interval = setInterval(updateCountdown, 1000);
            
//                 function updateCountdown() {
//                     countdownEle.innerHTML = `${time}`;
//                     time--;
//                     if(time<0)
//                         {
//                             clearInterval(interval);
//                         }
//                 }
//             });
            
//               // setTimeout(() => {

//               // }, i*1000);
//               let ques = `${result[i].question}`;
//                 let opt = "";
//                 result[i].incorrect_answers.forEach((op) => {
//                   opt += `<div class="int">
//                             <input type="radio"  name="options">
//                             <label for="${op}">${op}</label>
//                         </div>`;
//                 });
//                 opt += `<div class="int">
//                         <input type="radio"  name="options">
//                         <label for="${result[i].correct_answer}">${result[i].correct_answer}</label>
//                         </div>`;
//                 document.querySelector(".ext1").innerHTML = ques;
//                 document.querySelector(".ext2").innerHTML = opt;
//                 if(i==result.length-1)
//                     {
//                         setTimeout(()=> window.location.href = 'ques.html',1000);
//                     }
//             }
//           }

//     }
//     catch(error){
//         console.error(error);
//         setTimeout(fetchapi,500);
//     }
// }
// fetchapi();

async function fetchAndDisplayQuestions() {
  try {
      let res = await fetch("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple");
      let resjs = await res.json();
      let questions = resjs.results;
      
      if (questions) {
          let currentQuestionIndex = 0;
          displayQuestion(questions[currentQuestionIndex]);
          
          function moveToNextQuestion() {
              currentQuestionIndex++;
              if (currentQuestionIndex < questions.length) {
                  displayQuestion(questions[currentQuestionIndex]);
              } else {
                  
                  window.location.href = 'ques.html';
              }
          }
          
          function displayQuestion(question) {
              let options = "";
              question.incorrect_answers.forEach((option) => {
                  options += `<div class="int">
                                  <input type="radio" name="options">
                                  <label for="${option}">${option}</label>
                              </div>`;
              });

              options += `<div class="int">
                              <input type="radio" name="options">
                              <label for="${question.correct_answer}">${question.correct_answer}</label>
                          </div>`;

              document.querySelector(".ext1").innerHTML = question.question;
              document.querySelector(".ext2").innerHTML = options;
              
              startTimer();
          }

          function startTimer() {
              let time = 30;
              const countdownEle = document.querySelector(".timer");
              
              countdownEle.innerHTML = time;

              let interval = setInterval(updateCountdown, 1000);

              function updateCountdown() {
                  time--;
                  countdownEle.innerHTML = `${time}`;
                  
                  if (time === 0) {
                      clearInterval(interval);
                      moveToNextQuestion();
                  }
              }
          }
      }
  } catch (error) {
      console.error(error);
      setTimeout(fetchAndDisplayQuestions, 500);
  }
}

fetchAndDisplayQuestions();
