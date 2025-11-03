// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

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
const path = require('path');

const app = express();

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

// Diagnostic endpoint - remove after debugging email issue
app.get("/api/email-config-check", (req, res) => {
    res.json({
        emailUserConfigured: !!process.env.EMAIL_USER,
        emailPasswordConfigured: !!process.env.EMAIL_PASSWORD,
        emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}...@${process.env.EMAIL_USER.split('@')[1]}` : 'NOT SET',
        nodeEnv: process.env.NODE_ENV || 'not set'
    });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
