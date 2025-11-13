// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const accountsRouter = require("./routes/accounts");
const signinRouter = require("./routes/sign-in");
const growthRouter = require("./routes/growth");
const babiesRouter = require("./routes/babies");
const sleepRouter = require("./routes/sleep");
const medsRouter = require("./routes/meds");
const allergiesRouter = require("./routes/allergies");
const vaccinationsRouter = require("./routes/vaccinations");
const sickDayRouter = require("./routes/sickday");
const feedingRouter = require("./routes/feeding");
const observationRouter = require("./routes/observation");
const userRouter = require("./routes/user");
const babysitterSharingRouter = require("./routes/babysitter-sharing");
const photoGalleryRouter = require("./routes/photo-gallery");
const sharedTasksRouter = require("./routes/shared-tasks");
const messagingRouter = require("./routes/messaging");
const path = require('path');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "https://*.cloudfunctions.net"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, 
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
}));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  
  if (req.path.startsWith('/uploads/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://parent-pal-86b9a.web.app",
  "https://parent-pal-86b9a.firebaseapp.com",
  "https://parentpals.ca",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.json({
        message: "ParentPal API",
        status: "running",
        endpoints: {
            health: "/api/test",
        }
    });
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Server is running!" });
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use("/api/accounts", accountsRouter);
app.use("/api/sign-in", signinRouter);
app.use("/api/growth", growthRouter);
app.use("/api/babies", babiesRouter);
app.use("/api/sleep", sleepRouter);
app.use("/api/meds", medsRouter);
app.use("/api/allergies", allergiesRouter);
app.use("/api/vaccinations", vaccinationsRouter);
app.use("/api/sickday", sickDayRouter);
app.use("/api/feeding", feedingRouter);
app.use("/api/observation", observationRouter);
app.use("/api/user", userRouter);
app.use("/api/babysitter-sharing", babysitterSharingRouter);
app.use("/api/photo-gallery", photoGalleryRouter);
app.use("/api/shared-tasks", sharedTasksRouter);
app.use("/api/messaging", messagingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
