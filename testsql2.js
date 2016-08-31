var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

pool.query("DROP TABLE IF EXISTS todox",
                function(err){
                var createString = "CREATE TABLE todox(" +
                "id INT PRIMARY KEY AUTO_INCREMENT," +
                "name VARCHAR(255) NOT NULL," +
                "done BOOLEAN," +
                "due DATE)";
                pool.query(createString,
                        function(err){
                        console.log("Done");
                        pool.query("INSERT INTO todox (`name`) VALUES (?)", ["test:myname"], function(err, result){
                                if(err){ next(err); return; }
                                pool.query('SELECT * FROM todox', function(err, rows, fields){
                                        if(err){ next(err); return; }
                                        console.log(JSON.stringify(rows));
                                        process.exit(0);
                                        })
                                });
                        });
                });