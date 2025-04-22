
// my requirement
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//connection


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'quiz_app',
});

db.connect((err) => {
  if (err) {
    console.error(' connection failed :', err);
    return;
  }
  console.log(' Connected to my database');
});


//get data from quizzers
app.get('/api/quizzes', (req, res) => {
  const sql = 'SELECT * FROM quizzes';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


app.get('/api/quizzes/:id', (req, res) => {
  const sql = 'SELECT * FROM quizzes WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});


app.get('/api/quizzes/:id/questions', (req, res) => {
  const sql = 'SELECT * FROM questions WHERE quiz_id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


app.get('/api/questions/:id/options', (req, res) => {
  const sql = 'SELECT * FROM options WHERE question_id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


app.post('/api/quizzes', (req, res) => {
  const { title } = req.body;
  const sql = 'INSERT INTO quizzes (title) VALUES (?)';
  db.query(sql, [title], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, title });
  });
});


app.post('/api/questions', (req, res) => {
  const { quiz_id, question_text } = req.body;
  const sql = 'INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)';
  db.query(sql, [quiz_id, question_text], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, quiz_id, question_text });
  });
});


app.post('/api/options', (req, res) => {
  const { question_id, option_text, is_correct } = req.body;
  const sql = 'INSERT INTO options (question_id, option_text, is_correct) VALUES (?, ?, ?)';
  db.query(sql, [question_id, option_text, is_correct], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, question_id, option_text, is_correct });
  });
});

//listenning my port
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
