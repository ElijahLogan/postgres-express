const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const PORT = 80;

const { Pool} = require('pg')
 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'notes',
  password: 'postgres',
  port: 5432,
})
 

app.get("/", (req, res) => {
	res.json({ message: "Hello World"  });
	
})

app.get("/health-check", (req, res) => {
	res.json({ message: "Server up and running"  });
})

app.listen(PORT, () => {
	console.log("Server Running on PORT", PORT);
})


app.post('/add', (req, res) => {
  console.log('req body',req.body.userId)
  const { userId, noteId,  part, description, tod } = req.body;
  console.log(userId, noteId, part, description, tod)
  const query = {
    text: 'INSERT INTO noteInfo (userId, noteId, part, description, tod) VALUES ($1, $2, $3, $4, $5)',
  values: [userId, noteId, part, description, tod]
  };
console.log(part)
  pool.query(query, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.send(err.stack)
    } else {
      console.log('worked');
      res.send(result.rows[0]);
    }
  });
});
