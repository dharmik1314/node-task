const jwt = require('jsonwebtoken');

// Middleware to protect routes
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
         return res.status(401).json({ 
        message: 'No token provided' 
    });
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) 
            return res.status(403).json({
           message: 'Invalid token' 
        });
        req.user = user;
        next();
    }); 
}

// Route to login and get a token
function loginRoute(req, res) {
    const { username, lastname, email } = req.body;
    if (!username || !lastname || !email) return res.status(400).json({ message: 'All fields are required' });
    // In real app, validate user credentials here
    const user = { username, lastname, email };
    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
}


module.exports = { authenticateToken, loginRoute };
