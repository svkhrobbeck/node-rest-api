const http = require("http");
const getBodyData = require("./util");
const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const errorRes = { status: 404, statusText: "NOT FOUND", error: "No such book exists!" };
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });

  // get all books (GET)
  if (req.url === "/api/books" && req.method === "GET") {
    fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", (err, content) => {
      if (err) throw err;

      const books = JSON.parse(content);
      const resp = { status: 200, statusText: "OK", books };
      res.end(JSON.stringify(resp));
    });
  }

  // create a new book (POST)
  else if (req.url === "/api/books" && req.method === "POST") {
    fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", async (err, content) => {
      if (err) throw err;
      const books = JSON.parse(content);

      const data = await getBodyData(req);
      const { title, pages, author } = JSON.parse(data);

      const newBook = { title, pages, author, id: v4() };
      books.push(newBook);

      const resp = { status: 200, statusText: "CREATED", book: newBook };
      res.end(JSON.stringify(resp));

      fs.writeFile(path.join(__dirname, "data", "db.json"), JSON.stringify(books), err => {
        if (err) throw err;
      });
    });
  }

  // get a book by id (GET)
  else if (req.url.match(/\/api\/books\/\w+/) && req.method === "GET") {
    fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", (err, content) => {
      if (err) throw err;
      const books = JSON.parse(content);

      const id = req.url.split("/")[3];
      const book = books.find(b => b.id === id);

      if (!book) return res.end(JSON.stringify(errorRes));
      const resp = { status: 200, statusText: "OK", book };

      res.end(JSON.stringify(resp));
    });
  }

  // update a book by id (PUT)
  else if (req.url.match(/\/api\/books\/\w+/) && req.method === "PUT") {
    fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", async (err, content) => {
      if (err) throw err;
      const books = JSON.parse(content);
      const id = req.url.split("/")[3];

      const idx = books.findIndex(b => b.id === id);
      if (idx < 0) return res.end(JSON.stringify(errorRes));

      const data = await getBodyData(req);
      const { title, pages, author } = JSON.parse(data);

      const updatedBook = {
        id: books[idx].id,
        title: title || books[idx].title,
        pages: pages || books[idx].pages,
        author: author || books[idx].author,
      };
      books[idx] = updatedBook;

      const resp = { status: 200, statusText: "UPDATED", book: updatedBook };
      res.end(JSON.stringify(resp));

      fs.writeFile(path.join(__dirname, "data", "db.json"), JSON.stringify(books), err => {
        if (err) throw err;
      });
    });
  }

  // delete a book by id (DELETE)
  else if (req.url.match(/\/api\/books\/\w+/) && req.method === "DELETE") {
    fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", (err, content) => {
      if (err) throw err;
      let books = JSON.parse(content);

      const id = req.url.split("/")[3];
      const idx = books.findIndex(b => b.id === id);

      if (idx < 0) return res.end(JSON.stringify(errorRes));
      books = books.filter(b => b.id !== id);

      const resp = { status: 200, statusText: "DELETED" };
      res.end(JSON.stringify(resp));

      fs.writeFile(path.join(__dirname, "data", "db.json"), JSON.stringify(books), err => {
        if (err) throw err;
      });
    });
  }
});

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
