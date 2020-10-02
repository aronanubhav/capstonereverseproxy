//Adding the file here for Docker

const http = require('http');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: "capstonesentiment2.cjzgfj3nh7rd.eu-west-1.rds.amazonaws.com",
  user: "sentiment",
  password: "sentiment",
  database: "capstonesentiment2"
});

//html string that will be send to browser
var reo ='<html><head><title>Node.js MySQL Select</title></head><body  style="background-color:powderblue;"><h1>Node.js MySQL Select</h1>{${table}}</body></html>';

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
function setResHtml(sql, cb){
  pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].textbox +'</td><td>'+ res[i].sentiment_score +'</td></tr>';
      }
      table ='<table border="2"><tr><th>Nr.</th><th>textbox</th><th>sentiment_score</th>'+ table +'</table>';

      con.release(); //Done with mysql connection
      return cb(table);
    });
  });
}

let sql ='SELECT textbox, sentiment_score FROM capstonesentiment';

//create the server for browser access
const server = http.createServer((req, res)=>{
  setResHtml(sql, resql=>{
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo, 'utf-8');
    res.end();
  });
});

server.listen(8080, ()=>{
  console.log('Server running at //localhost:8080/');
});