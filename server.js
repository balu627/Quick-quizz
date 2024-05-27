const url = require("url");
const http = require("http");

const host = "127.0.0.1";
const port = 8000;

async function apifetch() {
  const response = await fetch(
    "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
  );
  const responsejs = await response.json();
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
