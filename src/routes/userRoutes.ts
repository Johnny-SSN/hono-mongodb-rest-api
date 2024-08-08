import { user } from "../controllers";
import { Hono } from "hono";
import { isAdmin, protect } from "../middlewares";

const users = new Hono();

users.get("/", protect, isAdmin, (c) => user.getUsers(c));

users.post("/", (c) => user.createUser(c));

users.post("/login", (c) => user.loginUser(c));

users.get("/:id", protect, (c) => user.getOneUser(c));

users.put("/update/:id", protect, (c) => user.updateUser(c));

users.delete("/delete/:id", protect, (c) => user.deleteUser(c));

export default users;
