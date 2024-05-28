const url = require("url");
const http = require("http");
const mysql = require("mysql");

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "project"
};

const host = "127.0.0.1";
const port = 8000;

const connection = mysql.createConnection(dbconfig);

connection.connect(function (err){
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

async function apifetch() {
  const response = await fetch(
    "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
  );
  const responsejs = await response.json();
  const result = responsejs.results;
  result.forEach(singleres =>{
    let question  = singleres.question;
    let options= singleres.incorrect_answers+",";
    options+=singleres.correct_answer;
    const sqlQuery = "INSERT INTO quiz (question,answer,correct_answer) VALUES (?,?,?)";
    const values = [question,options,singleres.correct_answer];

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
    apifetch().then((data) => {
      res.end(data);
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
