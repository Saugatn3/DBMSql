const express = require('express');
const path = require('path');
const pg = require('pg');
const config = require('./config')

const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = new pg.Client(config.conString);
client.connect(function (err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
  console.log('connected to db');
});

// Start the Express.js server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
  console.log('ahh');
});


app.get('/submit', (req, res) => {

  const studentName = req.query.name;
  const studentId = req.query.stid;

  const insertQuery = `INSERT INTO tbl_Input (id,"name") VALUES (${studentId},'${studentName}')`;

  client.query(insertQuery, function (err, result) {
    if (err) {
      console.error('error running query', err);
      return res.status(500).json({ error: 'An error occurred while adding data to the database' });
    }
    console.log(`added ${studentName}`)
  });
});

app.get('/view', (req, res) => {
  const selectQuery = `SELECT * FROM tbl_Input`;
  client.query(selectQuery, function (err, result) {
    if (err) {
      console.error('error running query', err);
      return res.status(500).json({ error: 'An error occurred while adding data to the database' });
    }
    console.log(result.rows);
    res.send(result.rows);
  });
});
app.use(cors());
app.use(express.static(__dirname));