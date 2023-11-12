const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookie = require("cookie-parser");
const cors = require("cors");

// Config
dotenv.config();

// Connect DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongoDB");
    } catch (err) {
        throw err;
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected");
});

const app = express();

app.use(cors());

// Cookie parser
app.use(cookie());

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// View engine setup
app.engine('.hbs', exphbs());
app.set('view engine', '.hbs');

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/me", require("./routes/me"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/albums", require("./routes/albums"));
app.use("/api/playlists", require("./routes/playlists"));
app.use("/api/artists", require("./routes/artists"));
app.use("/api/search", require("./routes/search"));

// Error handlers
app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || "";
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack,
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    connectDB();
    console.log("Server is listenning on port " + PORT);
});