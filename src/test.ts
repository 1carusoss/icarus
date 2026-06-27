// src/test.ts
import { WebServer, Middleware, Route, ParseBody } from "./server";

@WebServer({ port: 4000 })
class UserAPI {
  @Route("GET", "/users")
  @Middleware((req, res) => {
    res.setHeader("Content-Type", "application/json");
  })
  getUsers(req, res) {
    res.end(JSON.stringify([{ id: 1, name: "John Doe" }]));
    // test
    // curl -X POST http://localhost:4000/users
  }

  @Route("POST", "/users")
  @ParseBody()
  createUser(req, res) {
    res.end(req.body);
  }
  // test
  // curl -X POST http://localhost:4000/users -d '{"id": 2, "name": "Jane Doe"}' -H "Content-Type: application/json"
}

const server = new UserAPI();
