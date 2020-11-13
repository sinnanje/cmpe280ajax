var express=require('express');
var bodyParser=require('body-parser');
var mysql=require('mysql');
app=express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var db = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'user_data',
    port: 3306
});

db.connect(function(err,connection){
    if(err) {
        console.log(err);
    } else {
        app.post('/savedemo',function(req,res){
            console.log(req.body);
        
             var user={userid:req.body.patientid,firstname:req.body.firstname}
        
            db.query('INSERT into user SET ?',user,function(err,res){
                    if(err){
                        throw err;
                    }
                        else{
                        console.log(res);
        
                   }      
        
            })
           res.send(JSON.stringify(req.body));
        })

        app.post('/savevitals',function(req,res){
            console.log(req.body);
        
             var user={patientid:req.body.patientid,height:req.body.height}
        
            db.query('INSERT into vitals SET ?',vitals,function(err,res){
                    if(err){
                        throw err;
                    }
                        else{
                        console.log(res);
        
                   }      
        
            })
           res.send(JSON.stringify(req.body));
        })

        app.post('/syncdemo',function(req,res){
            console.log(req.body);

            var d = req.body;

            var data = JSON.parse(JSON.stringify(d));

            data.forEach(function (item) {

                if(item.age == null || item.age==''){
                    item.age=0;
                }
            
                var user={userid:item.patientid,firstname:item.firstname,lastname:item.lastname,
                    age:item.age,gender:item.gender,notes:item.other,photo:item.photo}

                db.query('SELECT * from vitals where userid=?',item.patientid,function(err,rows){
                        if(err){
                            throw err;
                        }
                        else{
                            console.log("rows:" + rows.length);
                            if(rows.length > 0) {
                                db.query('UPDATE user SET firstname=?,lastname=?,age=?,gender=?,notes=?,photo=? WHERE userid=?',[item.firstname,item.lastname,item.age,item.gender,item.other,item.photo,item.patientid],function(err,res){
                                    if(err){
                                        console.log("error");
                                        throw err;
                                    }
                                    else{
                                        console.log(res.affectedRows);
                                   }      
                        
                                })
                            } else {
                                db.query('INSERT into user SET ?',user,function(err,res){
                                    if(err){
                                        throw err;
                                    }
                                        else{
                                        console.log(res);
                        
                                   }      
                        
                                })
                            }
                       }      
            
                })
               
            });
        
           res.send(JSON.stringify(req.body));
        })

        app.post('/syncvitals',function(req,res){
            console.log(req.body);

            var d = req.body;

            var data = JSON.parse(JSON.stringify(d));

            data.forEach(function (item) {

            
                var vitals={userid:item.patientid,height:item.height,weight:item.weight,
                    temperature:item.temperature,pulse:item.pulse,bp:item.bp,medications:item.medications,notes:item.notes}

                db.query('SELECT * from vitals where userid=?',item.patientid,function(err,rows){
                        if(err){
                            throw err;
                        }
                        else{
                            console.log("rows:" + rows.length);
                            if(rows.length > 0) {
                                db.query('UPDATE vitals SET height=?,weight=?,temperature=?,pulse=?,bp=?,medications=?,notes=? WHERE userid=?',[item.height,item.weight,item.temperature,item.pulse,item.bp,item.medications,item.notes,item.patientid],function(err,res){
                                    if(err){
                                        console.log("error");
                                        throw err;
                                    }
                                    else{
                                        console.log(res.affectedRows);
                                   }      
                        
                                })
                            } else {
                                db.query('INSERT into vitals SET ?',vitals,function(err,res){
                                    if(err){
                                        throw err;
                                    }
                                        else{
                                        console.log(res);
                        
                                   }      
                        
                                })
                            }
                       }      
            
                })
               
            });
        
           res.send(JSON.stringify(req.body));
        })

        app.get('/report',function(req,res){
           console.log(req.body);
        
            // var user={userid:1,firstname:req.body.firstname}
        
            db.query('SELECT u.firstname,u.age,u.gender,u.photo,v.medications,v.notes from user u left join vitals v on u.userid=v.userid',function(err,rows){
                    if(err){
                        throw err;
                    }
                    else{
                        console.log("rows: " + rows);
                        res.send(rows);
                   }      
        
            })
            
           //res.send(JSON.stringify(req.body));
        })
    }
});

/**/

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(3000);

console.log('Running at Port 3000');