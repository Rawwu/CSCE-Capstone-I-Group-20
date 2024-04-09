const router = require('express').Router();

// Define your login route
router.post('/login', (req, res) => {
  // Add login functionality here (e.g., verify credentials)
  const { username, password } = req.body;
  // Check if username and password are valid
  if (username === 'admin' && password === 'password') {
    // If valid, send success response
    res.status(200).json({ message: 'Login successful' });
  } else {
    // If invalid, send error response
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

module.exports = router;