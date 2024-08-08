import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { errorHandler, isAdmin, notFound } from "./middlewares";
import { refreshToken } from "./controllers";
import connectDB from "./config/db";
import users from "./routes/userRoutes";

const app = new Hono().basePath("/api/v1");

connectDB();

app.use("*", logger(), prettyJSON());

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.post("/refresh-token", (c) => refreshToken(c));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/users", users);

// Error Handler
app.onError((err, c) => {
  const error = errorHandler(c);
  return error;
});

// Not Found Handler
app.notFound((c) => {
  const error = notFound(c);
  return error;
});

const port = Bun.env.PORT || 8000;

export default { port, fetch: app.fetch };
