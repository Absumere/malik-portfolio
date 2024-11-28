module.exports = (req, res) => {
  res.json({
    message: 'Hello from Malik\'s Portfolio API!',
    timestamp: new Date().toISOString()
  });
};
