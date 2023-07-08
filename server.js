const express = require('express');
const path = require('path');
const pg = require('pg');
const config = require('./config.js')
const port = 3001;

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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
  console.log('ahh');
});


app.get('/submit', (req, res) => {

  const studentName = req.query.name;
  const studentId = req.query.stid;
  const studentaddress = req.query.address;
  const studentdob= req.query.dob;

  const insertQuery = `INSERT INTO tbl_Input (id,"name","address","dob") VALUES (${studentId},'${studentName}','${studentaddress}','${studentdob}')`;

  client.query(insertQuery, function (err, result) {
    if (err) {
      console.error('error running query', err);
      return res.status(500).json({ error: 'An error occurred while adding data to the database' });
    }
    res.status(200).json({ message: 'Data Added' });
    console.log(`added ${studentName}`)
  });
});

app.get('/view', (req, res) => {
  const selectQuery = `SELECT * FROM tbl_Input ORDER BY id ASC`;
  client.query(selectQuery, function (err, result) {
    if (err) {
      console.error('error running query', err);
      return res.status(500).json({ error: 'An error occurred while adding data to the database' });
    }
    console.log(result.rows);
    res.send(result.rows);
  });
});

app.get('/delete', (req, res) => {
  const selectQuery = `SELECT * FROM tbl_Input where id = ${req.query.id}`;
  const deleteQuery = `DELETE FROM tbl_Input WHERE id = ${req.query.id}`
  client.query(selectQuery, function (err, result) {
    if (err) {
      console.error('error running query', err);
      return res.status(500).json({ error: 'An error occurred ' });
    }
    client.query(deleteQuery,function (err, result) {
      if (err) {
        console.error('error running query', err);
        return res.status(500).json({ error: 'An error occurred while deleting the data' });
      }
      console.log('Deleted record');
      res.status(200).json({ message: 'Deletion successful' });
    });
  });
});


  app.put('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { name, address, dob } = req.body;
  
    const updateQuery = `
      UPDATE tbl_Input
      SET "name" = '${name}', "address" = '${address}', "dob" = '${dob}'
      WHERE id = ${id}
    `;
  
    client.query(updateQuery, (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        return res.status(500).json({ error: 'An error occurred while updating the data' });
      }
      res.json({ message: 'Data Updated' });
    });
  });
  

app.use(cors());
app.use(express.static(__dirname))