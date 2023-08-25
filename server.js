const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const mysql = require('mysql');
let fetch;
(async () => {
  const nodeFetch = await import('node-fetch');
  fetch = nodeFetch.default;
})();

const PORT = 5000;
const API_KEY = process.env.API_KEY;

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user:'root',
  password:'' ,
  database: 'signup'
};

const pool = mysql.createPool(dbConfig);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// API endpoint for GPT-3.5 completions
app.post('/completions', async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100
    })
  };
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// API endpoint for user signup
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  pool.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error('Error executing the query:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    return res.status(200).json({ message: 'Signup successful' });
  });
});

// API endpoint for user login
app.post('/login', (req, res) => {
  console.log("login")
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  pool.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error executing the query:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    if (result.length === 0) {
      console.log("Invalid credentials");
      return res.status(200).json({ message: 'Invalid credentials' });
    }
    console.log(result[0]);
    return res.status(200).json({ result: result[0], message: 'Login successful' });
  });
});

app.listen(PORT, () => {
  console.log("Your Server is running on PORT: " + PORT);
});
