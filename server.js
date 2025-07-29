const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');

app.use(express.json()); // to parse JSON request bodies
app.use('/api/users', userRoutes); // mount the user routes

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
