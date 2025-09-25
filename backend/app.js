require('dotenv-flow').config();

const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middlewares/authMiddleware');
const corsMiddleware = require('./cors');
const limiter = require('./middlewares/ratelimitMiddleware');
const ExpressError = require('./middlewares/expressError');

const app = express();
const port = process.env.PORT || 5000;

// Connect to database
connectDB();

// view engine
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.options('/*splat', corsMiddleware);
app.use(corsMiddleware);

//routes
app.get('/{*any}', checkUser);
app.get('/', (req, res) => res.status(200).send('API is running...'));
app.use("/api/users", checkUser, authRoutes);
app.use("/api/trips", tripRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// general error handler
app.use(function (req, res) {
    res.status(404).render('404', { title: '404' });
});

module.exports = app;   