const fs = require('fs');
const http = require('http');

const hostname = 'ec2-35-165-191-120.us-west-2.compute.amazonaws.com';
const port = 80;

var admin = require("firebase-admin");

var serviceAccount = require("/home/ec2-user/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommunicate-5a295.firebaseio.com"
});

var registrationToken = "e6AVusNPakw:APA91bFDfSWdFqebtawjWLnphbwIMWYsBLbznA6nhrNbG-2snYapXgg26HrHy8tsbkbPUjMFn4__EcJXRh4Flca_5NEuaX3VFTy_2gcf4-q2wP6mEkbs2kFTt0Bwr4lr2VObgDsCpP-N";

var payload = {
  notification: {
    title: "message title",
    body: "message body"
  }
};


admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Test\n');
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

var mysql_db_password = fs.readFileSync('/home/ec2-user/secrets.txt').toString().split('\n')[0];

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'tutorial-db-instance.cphov5mfizlt.us-west-2.rds.amazonaws.com',
  user     : 'nodejs_server',
  password : mysql_db_password,
  database : 'open',
  port : '3306',
});
 
connection.connect();

connection.query('select * from messages;',function (error, results, fields) {

    console.log(results[0]);

});

connection.end();

server.on('request', (request, response) => {

    let body = [];
    request.on('data', (chunk) => {
	body.push(chunk);


    }).on('end', () => {
	body = Buffer.concat(body).toString();

	console.log(decodeURIComponent(body));

	console.log(body);
    });

});
