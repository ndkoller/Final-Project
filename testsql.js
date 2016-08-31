var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

  pool.query("DROP TABLE IF EXISTS workouts",
                function(err){
                var createString = "CREATE TABLE workouts(" +
                "id INT PRIMARY KEY AUTO_INCREMENT," +
				"name VARCHAR(255) NOT NULL," +
				"reps INT," +
				"weight INT," +
				"date DATE," +
				"lbs BOOLEAN)";
                pool.query(createString,
                        function(err){
                        console.log("Done");
                        pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.body.name,req.body.reps,req.body.weight ,req.body.date, req.body.unit], function(err, result){
                                if(err){ next(err); return; }
                                pool.query('SELECT * FROM workouts', function(err, rows, fields){
                                        if(err){ next(err); return; }
                                        console.log(JSON.stringify(rows));
                                        process.exit(0);
                                        })
                                });
                        });
                });