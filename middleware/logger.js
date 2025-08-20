const fs = require('fs');
const path = require('path');



module.exports = logger =((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logEntry = `\n[${new Date().toISOString()}] ${res.statusCode} ${req.method} ${req.url} - ${duration}ms`;
        fs.appendFile('loggingDetails.txt', logEntry, () => {});
    });
    next();
});
