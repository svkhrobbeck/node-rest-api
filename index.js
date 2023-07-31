const http = require("http");
const getBodyData = require("./util");
const { v4 } = require("uuid");

let books = [{ id: "2", title: "Book n1", pages: 250, author: "Writer 1" }];
const errorRes = { status: 404, statusText: "NOT FOUND", error: "No such book exists!" };
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });

  // get all books (GET)
  if (req.url === "/api/books" && req.method === "GET") {
    const resp = { status: 200, statusText: "OK", books };
    res.end(JSON.stringify(resp));
  }

  // create a new book (POST)
  else if (req.url === "/api/books" && req.method === "POST") {
    const data = await getBodyData(req);
    const { title, pages, author } = JSON.parse(data);

    const newBook = { title, pages, author, id: v4() };
    books.push(newBook);

    const resp = { status: 200, statusText: "CREATED", book: newBook };
    res.end(JSON.stringify(resp));
  }

  // get a book by id (GET)
  else if (req.url.match(/\/api\/books\/\w+/) && req.method === "GET") {
    const id = req.url.split("/")[3];
    const book = books.find(b => b.id === id);

    if (!book) return res.end(JSON.stringify(errorRes));
    const resp = { status: 200, statusText: "OK", book };

    res.end(JSON.stringify(resp));
  }

  // update a book by id (PUT)
  else if (req.url.match(/\/api\/books\/\w+/) && req.method === "PUT") {
    const id = req.url.split("/")[3];
    const idx = books.findIndex(b => b.id === id);

    const book = books.find(b => b.id === id);
    if (!book) return res.end(JSON.stringify(errorRes));

    const data = await getBodyData(req);
    const { title, pages, author } = JSON.parse(data);

    const updatedBook = { id: book.id, title: title || book.title, pages: pages || book.pages, author: author || book.author };
    books[idx] = updatedBook;

    const resp = { status: 200, statusText: "UPDATED", book: updatedBook };
    res.end(JSON.stringify(resp));
  }

  // delete a book by id (DELETE)
  else if (req.url.match(/\/api\/books\/\w+/) && req.method === "DELETE") {
    const id = req.url.split("/")[3];
    const book = books.find(b => b.id === id);

    if (!book) return res.end(JSON.stringify(errorRes));
    books = books.filter(b => b.id !== id);

    const resp = { status: 200, statusText: "DELETED" };
    res.end(JSON.stringify(resp));
  }
});

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
