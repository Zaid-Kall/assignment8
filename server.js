import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const courses = [
  { id: 1, title: "Web Programming", credits: 6 },
  { id: 2, title: "Database Systems", credits: 6 },
  { id: 3, title: "Software Engineering", credits: 5 },
];

let requestsServed = 0;

// Request logger: prints one line per request, then passes control on
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}

// Request counter: counts every request that reaches the server
function requestCounter(req, res, next) {
  requestsServed += 1;
  next();
}

app.use(requestLogger);
app.use(requestCounter);

app.get("/hello", (req, res) => {
  res.type("text/plain").send("Hello from Zaid's server");
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /api/admin\n");
});

app.get("/old-page", (req, res) => {
  res.redirect("/hello");
});

app.get("/api/courses", (req, res) => {
  res.json(courses);
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.get("/api/headers", (req, res) => {
  res.json({
    userAgent: req.get("User-Agent"),
    accept: req.get("Accept"),
  });
});

app.post("/api/subscribe", (req, res) => {
  res.status(201).json({ subscribed: true });
});

app.get("/api/admin", (req, res) => {
  res.status(403).json({ error: "Forbidden" });
});

app.get("/api/stats", (req, res) => {
  res.json({ requestsServed });
});

// 404 fallback: must stay LAST, so it never hides a real route
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).json({ error: "Not found" });
  } else {
    res.status(404).send("<h1>404</h1><p>Page not found.</p>");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});