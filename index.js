const express = require("express");
const bodyParser = require('body-parser');
const postgres = require('postgres')

const fs = require('fs'),
    http = require('http'),
    https = require('https');

const options = {
    ca: fs.readFileSync("../etc/ssl/ca_bundle.crt", 'utf8'),
    key: fs.readFileSync("../etc/ssl/private/private.key",'utf8'),
    cert: fs.readFileSync("../etc/ssl/certificate.crt",'utf8'),
};

const app = express();
//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

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



const sql = postgres('postgres://postgres:postgres@localhost:5432/notes')

app.get('/.well-known/pki-validation/F391FB13DE4933749C40DEAB2F500009.txt', function (req, res) {
	//res.sendFile(absolutePath)
	res.set('content-type', 'text/plain')
	let a = '9EDE0BFE7669263EFFAC224F6784C0A857707AECD0DECED8F5C905862217E493\ncomodoca.com\na18a2473ec5e9e2'
	res.send(a)
});

app.get("/", (req, res) => {
	res.json({ message: "Hello World"  });
	
})

app.get("/health-check", (req, res) => {
	res.json({ message: "Server up and running"  });
})

const server = https.createServer(options, app).listen(PORT, function(){
  console.log("Express server listening on port " + PORT);
});

app.get('/list', async (req, res) => {
        const userId = req.query.userId;
	// pg logic not needed
        const query = {
                text: 'SELECT  * from noteInfo WHERE userid =  $1',
                values: [userId]
        }
        await pool.query(query, (err, result) => {
                if (err) {
                        console.log(err.stack)
                } else {
 //                       console.log(result.rows)
//                        console.log('worked')
                       // res.send(result)
                       // console.log((JSON.stringify(result)))
                }
                  });
        // sql logic from postgres libary
	const users = await sql`
  	select
   	 *
  	from noteInfo
	where userId = ${userId}`
//	res.send(users)
	let cleaned_users = looper(users)
	res.send(cleaned_users)
	//func end

});

function looper (l){
	console.log(l.length)
	let bucket = []
	for (let i = 0; i < l.length; i++){
		let item = l[i]
		bucket.push(item)
	}
	return bucket
}

app.post('/add', (req, res) => {

  const { userId, noteId,  part, description, tod } = req.body;
  const query = {
    text: 'INSERT INTO noteInfo (userId, noteId, part, description, tod) VALUES ($1, $2, $3, $4, $5)',
  values: [userId, noteId, part, description, tod]
  };
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
