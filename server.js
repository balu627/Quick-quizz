const url = require("url");
const http = require("http");
const mysql = require("mysql");

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "project",
};

const host = "127.0.0.1";
const port = 8000;

const connection = mysql.createConnection(dbconfig);

connection.connect(async function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
  apifetch();
});

async function apifetch() {
  const truncatequery = "truncate table quiz;";
  connection.query(truncatequery, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Truncate successfull");
  });

  const response = await fetch(
    "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
  );
  const responsejs = await response.json();
  const result = responsejs.results;
  result.forEach((singleres) => {
    let question = singleres.question;
    let options = singleres.incorrect_answers + ",";
    let opt1 = "";
    let opt2 = "";
    let opt3 = "";
    let count = 0;
    singleres.incorrect_answers.forEach((opt) => {
      if (count == 0) {
        opt1 = opt;
      }
      if (count == 1) {
        opt2 = opt;
      }
      if (count == 2) {
        opt3 = opt;
      }
      count++;
    });
    const sqlQuery =
      "INSERT INTO quiz (question,option1,option2,option3,correct_answer) VALUES (?,?,?,?,?)";
    const values = [question, opt1, opt2, opt3, singleres.correct_answer];

    connection.query(sqlQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting data into MySQL:", err);
        return;
      }
      console.log("Data inserted into MySQL table successfully");
    });
  });

  return JSON.stringify(responsejs);
}
const server = http.createServer((req, res) => {
  const parsedurl = url.parse(req.url, true);
  const path = parsedurl.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (path === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("main");
  } else if (path === "/fetch") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");

    let query = "select * from quiz;";
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.end("Error fetching data from database");
        return;
      }
      console.log("Select all successful");
      res.end(JSON.stringify(result));
    });
  } else  if (path === "/add" && req.method === "POST") {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
    });

    req.on("end", () => {
      const parsedData = JSON.parse(data);
      const questions = parsedData.questions;

      // Insert questions into the database
      questions.forEach(question => {
        const sqlQuery =
          "INSERT INTO quiz (question, option1, option2, option3, correct_answer) VALUES (?, ?, ?, ?, ?)";
        const values = [
          question.question,
          question.options[0],
          question.options[1],
          question.options[2],
          question.correctOption
        ];

        connection.query(sqlQuery, values, (err, result) => {
          if (err) {
            console.error("Error inserting data into MySQL:", err);
            return;
          }
          console.log("Data inserted into MySQL table successfully");
        });
      });

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Data received and processed successfully");
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("url not found");
  }
});

server.listen(port, host, () => {
  console.log(`Server Running in ${host}:${port}`);
});
