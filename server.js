require('dotenv').config();
const { Model } = require('sequelize');
const sequelize = require('./config/database.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const { authenticateToken, loginRoute } = require('./middleware/auth.js');
const app = express();
const fs = require('fs');
const { tutorialValidationSchema, userValidationSchema } = require('./middleware/joivalidation');
const validate = require('./middleware/validate');
const user = require('./models/user.js');
const loginRoutes = require('./routes/login');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/user.routes');
require('dotenv').config()

//middleware
app.use(express.json());
app.use(logger);
app.use(express.static(path.join(__dirname))); // Serve static files from project root

// Public login route for JWT token
app.use('/api/login',authenticateToken, loginRoutes);

// Protect all /api/users routes with authentication
app.use('/api/users', userRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
    const errorLog = `\n[${new Date().toISOString()}] ERROR: ${err.message} ${req.method} ${req.url} IP: ${req.ip}`;
    fs.appendFile('loggingDetails.txt', errorLog, () => {});
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

//port
const PORT = process.env.PORT;

//sync database and start server
sequelize.sync().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});