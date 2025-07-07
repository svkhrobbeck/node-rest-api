const http = require("http");

class Server {
  #server;
  #routes = {};

  constructor() {
    this.#server = http.createServer(this.#handleRequest.bind(this));
  }

  #addRoute(method, url, callback) {
    const key = `${method}:${url}`;
    this.#routes[key] = callback;
  }

  #handleRequest(req, res) {
    const key = `${req.method}:${req.url}`;
    const routeHandler = this.#routes[key];

    if (routeHandler) {
      return routeHandler(req, res);
    }

    res.statusCode = 404;
    res.end("Not Found");
  }

  get(url, callback) {
    this.#addRoute("GET", url, callback);
  }

  post(url, callback) {
    this.#addRoute("POST", url, callback);
  }

  put(url, callback) {
    this.#addRoute("PUT", url, callback);
  }

  patch(url, callback) {
    this.#addRoute("PATCH", url, callback);
  }

  delete(url, callback) {
    this.#addRoute("DELETE", url, callback);
  }

  head(url, callback) {
    this.#addRoute("HEAD", url, callback);
  }

  options(url, callback) {
    this.#addRoute("OPTIONS", url, callback);
  }

  start(port, callback) {
    this.#server.listen(port, callback);
  }
}

module.exports = Server;
