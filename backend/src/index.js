import express from "express";
import session from "express-session";
import cors from "cors";
import { CORS_ORIGIN, PORT, SESSION_SECRET_KEY } from "./config/index.js";
import dataRouter from "./routes/data.routes.js";
const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true, // ✅ must be inside the object
  })
);

app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 },
  })
);

app.use("/api/data", dataRouter);

app.listen(PORT || 5000, () => {
  console.log(`Smart Report Automator runs on ${PORT}`);
});

export default app;
