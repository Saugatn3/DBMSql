const express = require('express');
const path = require('path');
const pg = require('pg');
const config = require('./config.js')
const bcrypt = require('bcrypt')
const port = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = new pg.Client(config.conString);
client.connect(function (err) {
  if (err) {
    return console.error('Could not connect to postgres', err);
  }
  console.log('Connected to db');
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
  console.log('ah');
});

app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, 'login.html');
  res.sendFile(filePath);
})

app.post('/login', async (req, res) => {
  const studentname = req.body.name;
  const studentpassword = req.body.password;
  const insertQuery = `SELECT * FROM tbl_Input WHERE name = '${studentname}'`;
  const checkQuery = `SELECT * FROM tbl_Users INNER JOIN tbl_Input ON tbl_Users.user_id = tbl_Input.id WHERE tbl_Input.name = '${studentname}'`;
  client.query(insertQuery, function (err, result) {
    if (err) {
      console.error('error running query', err);
      return res.status(500).json({ error: 'An error occurred while running qurey' });
    }
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    client.query(checkQuery, function (err, result) {
      if (err) {
        console.error('error running query', err);
        return res.status(500).json({ error: 'An error occurred' });
      }
      const user = result.rows[0];
      bcrypt.compare(studentpassword, user.password, function (err, result) {
        if (err) {
          console.error('error running query', err);
          return res.status(500).json({ error: 'An error occurred while verifying user' });
        }
        if (result) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    });
  });
});


  app.get('/signup', (req, res) => {
    const filePath = path.join(__dirname, 'signup.html');
    res.sendFile(filePath);
  })


  app.post('/submit', async (req, res) => {

    const studentName = req.body.name;
    const studentId = req.body.stid;
    const studentaddress = req.body.address;
    const studentdob = req.body.dob;
    const studentpassword = req.body.password;
    const hashedpassword = await bcrypt.hash(studentpassword, 10);

    const insertQuery = `INSERT INTO tbl_Input (id,"name","address","dob") VALUES (${studentId},'${studentName}','${studentaddress}','${studentdob}')`;
    const insertQuery1 = `INSERT INTO tbl_Users (user_id,"password") VALUES (${studentId},'${hashedpassword}')`;

    client.query(insertQuery, function (err, result) {
      if (err) {
        console.error('error running query', err);
        return res.status(500).json({ error: 'An error occurred while adding data to the database' });
      }

      client.query(insertQuery1, function (err, result) {
        if (err) {
          console.error('error running query', err);
          return res.status(500).json({ error: 'An error occurred while adding data to the database' });
        }
      });
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
      client.query(deleteQuery, function (err, result) {
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

  app.use(express.static(__dirname))