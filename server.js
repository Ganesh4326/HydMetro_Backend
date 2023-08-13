const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors()); 
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const signupDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Gani@123', 
  database: 'mydatabase',
});

signupDB.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Signup
app.post('/api/signup', (req, res) => {
  console.log("sign up");
  const { first_name, last_name, email_id, password, re_password } = req.body;
  const sql = 'INSERT INTO signup_users (first_name, last_name, email_id, password, re_password) VALUES (?, ?, ?, ?, ?)';
  if(password == re_password){
    signupDB.query(sql, [first_name, last_name, email_id, password, re_password], (err, result) => {
      if (err) {
        console.error('Error signing up:', err);
        res.status(500).send('Error signing up');
        return;
      }
      res.status(200).send('Signup successful');
    });
  }else{
    console.log("passwords not matched");
    res.status(500).send('Passwords not matched');
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email_id, password } = req.body;
  const sql = 'SELECT * FROM signup_users WHERE email_id = ? AND password = ?';
  signupDB.query(sql, [email_id, password], (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).send('Error logging in');
      return;
    }
    if (result.length === 0) {
      res.status(401).send('Invalid credentials');
      return;
    }
    res.status(200).send('Login successful');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
