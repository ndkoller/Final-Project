
// the following is boilerplate from lecures
var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main.handlebars'});
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3002);

var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

// A Get Query that returns all info from database and renders the home page
app.get('/',function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('home', context);
  });
 
});

// This insert command is related to the new submission
app.post('/insert',function(req,res,next){
  console.log(req.body);
  var context = {};
		pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", 
		[req.body.name,req.body.reps,req.body.weight ,req.body.date, req.body.unit], 
		function(err, result){	if(err){ next(err); return; }
				
		});
		pool.query('SELECT * FROM workouts', 
					function(err, rows, fields)
					{
						if(err)	{	next(err);	return;	}
				
				context.results = JSON.stringify(rows);
				res.send(context.results); 
				
		});
	
});

app.post('/delete',function(req,res,next){
	console.log(req.body);
	 var context = {};
	pool.query("SELECT * FROM `workouts` WHERE id=?", [req.body.id], function(err, rows, fields){
						if(err){ next(err); return; }
						context.results = rows;
					})
	pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err,result){
		if(err){
		next(err);
		return;
		}
	})
});
app.post('/edit',function(req,res,next){
	console.log(req.body);
	 var context = {};
	
	pool.query("SELECT * FROM `workouts` WHERE id = ?", [req.body.id], function(err, result)
	{
		if(err)		{ next(err); return; }
		
		if(result.length == 1)
		{
			var curVals = result[0];
						
			pool.query("UPDATE `workouts` SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
			[req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.lbs || curVals.lbs, req.body.id],
			function(err, result)
			{ 
				if(err){ next(err); return;	}
			});
			
			pool.query('SELECT * FROM `workouts`', 
			function(err, rows, fields)
			{
				if(err) {next(err);	return;	}
			
				context.results = JSON.stringify(rows);	
				console.log("The updated table:");
				//console.log(context.results);
				console.log(JSON.stringify(context.results));
				res.send(context.results);
			});		
		}
	});
});
	/*
	pool.query("SELECT * FROM `workouts` WHERE id=?", [req.body.id], function(err, rows, fields){
						if(err){ next(err); return; }
						context.results = rows;
					})
	pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err,result){
		if(err){
		next(err);
		return;
		}
	})
	*/

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
"id INT PRIMARY KEY AUTO_INCREMENT,"+
"name VARCHAR(255) NOT NULL,"+
"reps INT,"+
"weight INT,"+
"date DATE,"+
"lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
  
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500')
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});


