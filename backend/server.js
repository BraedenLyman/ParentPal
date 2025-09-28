// server.js
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

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
