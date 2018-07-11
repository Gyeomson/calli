module.exports = function(app)
{
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    // password : '111111',
    database : 'calli',
    charset  : 'utf8'
  });
  conn.connect();
  conn.query('USE calli');
  
  var multer = require('multer');
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'router/upload/');
      },
      filename: function (req, file, cb) {
        var ex = file.originalname.split('.');
        cb(null, new Date().valueOf() +'.'+ ex[1]);
      }
    }),
  });
  const fs = require("fs");

  /**********LOGIN**************/
  app.get('/', function(req, res){
    console.log('\n\t==== ROUTE / ====');
    // console.log(req.session);
    var message;
    if(req.session.login == 'ID') {
      message = "입력하신 아이디와 비밀번호가 일치하지 않습니다. \n 다시 시도해 주세요";
    } else if(req.session.login == 'PW') {
      message = "입력하신 비밀번호가 맞지 않습니다. \n 다시 시도해 주세요";
    }
    if(req.session.login == 'logined') {
      res.redirect('/img');
    } else {
      res.render('index.ejs', {msg: message});
    }
  });
  app.post('/login', function(req, res){
    console.log('\n\t==== ROUTE /login ====');
    // console.log(req.body);
    if(req.body.id == 'admin'){
      // console.log('req.body.pw : '+req.body.pw);
      if(req.body.pw == 'admin') { //로그인 성공
        req.session.login = 'logined';
        // console.log('req.session.login : '+req.session.login);
        res.redirect("/main"); 
      } else { //비밀번호 틀림
        req.session.login = 'PW';
        res.redirect('/');
      }
    } else { //아이디 틀림
      req.session.login = 'ID';
      res.redirect('/');
    }
  });
  app.get('/logout', function(req, res){
    console.log('\n\t==== ROUTE /logout ====');
    req.session.destroy(function(err){
      if(err) res.redirect('/');
      // console.log(req.session);
      res.redirect('/');
    });
  });
  
  /**********VIEW**************/
  app.get('/main', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n\t==== ROUTE /main ====');
      var sql = 'SELECT * FROM total';
      conn.query(sql, function(err, result){
        if(err) console.log(err);
        else {
          console.log(result);
          res.render('main.ejs', {total: result});
        }
      });
    } else {
      res.redirect('/');
    }
  });
  app.get('/user', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n\t==== ROUTE /user ====');
      var sql = 'SELECT * FROM user';
      conn.query(sql, function(err, users){
        if(err) errControll(err, res);
        else {
          sql = 'SELECT count(id) FROM user';
          conn.query(sql, function(err, all){
            if(err) errControll(err, res);
            else {
              sql = 'SELECT count(id) FROM user WHERE gender="FEMALE"'
              conn.query(sql, function(err, female){
                if(err) errControll(err, res);
                else {
                  var male = all[0]["count(id)"] - female[0]["count(id)"];
                  sql = 'SELECT count(id) FROM user WHERE device="android"'
                  conn.query(sql, function(err, android){
                    if(err) errControll(err, res);
                    else {
                      var ios = all[0]["count(id)"] - android[0]["count(id)"];
                      res.render('user.ejs', {user:users, all:all[0]["count(id)"], male:male, female: female[0]["count(id)"], ios: ios, android:android[0]["count(id)"]});
                    }
                  }); //end of android
                }
              }); //end of female
            } 
          });// end of all count
        } 
      }); //end of all user
    } else {
      res.redirect('/');
    }
  });
  app.get('/img', function(req, res){
    if(req.session.login == 'logined') {
      console.log('\n\t==== ROUTE /img ====');
      var sql = "SELECT id, profile, name, calli, resource, click, down, DATE_FORMAT(created_at,'%Y.%m.%d %H:%i') as created_at FROM image ORDER BY created_at DESC";
      // console.log(sql);
      conn.query(sql, function(err, image){ //전체 이미지 목록
        if(err){
          errControll(err, res);
        } else {
          // console.log(image);
          conn.query('SELECT count(id) as count FROM image', function(err, count){ //전체 이미지 목록
            if(err){
              errControll(err, res);
            } else {
              // console.log(count[0].count);
              res.render('img.ejs', {image:image, count:count[0].count});
            } //end of else
          });
        } //end of else
      });
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/bgimg', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n\t==== ROUTE /bgimg ====');
      res.render('bgimg.ejs');
    } else {
      res.redirect('/');
    }
  });
  app.get('/bgimgUpload', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n\t==== ROUTE /bgimgUpload ====');
      res.render('bgimgUpload.ejs');
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/banner', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n\t==== ROUTE /banner ====');
      res.render('banner.ejs');
    } else {
      res.redirect('/');
    }
  });
  app.get('/bannerUpload', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n\t==== ROUTE /bannerUpload ====');
      res.render('bannerUpload.ejs');
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/imgUpload', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n\t==== ROUTE /imgUpload ====');
      var d = new Date();
      var month = d.getMonth()+1;
      if(month < 10) month = '0'+month;
      var date = d.getFullYear()+"-"+month+"-"+d.getDate();
      var time = d.getHours()+9;
      var min = d.getMinutes();
      if(min < 10) min = '0'+min;
      // console.log(date+' '+time+'시 '+min+'분');
      res.render('imgUpload.ejs', {date:date, time:time, min:min});
    } else {
      res.redirect('/');
    }
  });
  app.post('/upload', upload.single('img'), function(req, res){ //파일 업로드
    if(req.session.login == 'logined') {
      console.log('\n\t==== ROUTE /upload ====');
      var date=req.body.date+' '+req.body.time+':'+req.body.min;
      // console.log(date);
      // console.log('req.file : ');console.log(req.file);
      if(req.file != undefined) {
        var sql = "INSERT INTO image (name, calli, resource, created_at) VALUES(?, ?, ?, ?);";
        // console.log(sql);
        conn.query(sql, [req.file.filename, req.body.calli, req.body.resource, date], function(err, result){ //전체 이미지 목록
          if(err){
            console.log(err);
            res.redirect('/imgUpload');
          } else {
            // console.log(result);
            res.redirect('/img');
          }
        });
      } else {
        res.redirect('/imgUpload');
      }
      
    } else {
      res.redirect('/');
    }
  });
  
  /**********FUNCTION**************/
    /****image****/
    app.get('/show/:file_name', function(req, res){
      res.sendFile(__dirname + '/upload/' + req.params.file_name);
    });
    app.get('/period/:period', function(req, res){
      if(req.session.login == 'logined') {
        console.log('\n\t==== ROUTE /period_img ====');
        // console.log('period(day) : '+req.params.period);
        var now = new Date();
        var dayOfMonth = now.getDate();
        now.setDate(dayOfMonth - req.params.period);
        var month = now.getMonth()+1;
        if(month < 10) month = '0'+month;
        var date = now.getFullYear()+"-"+month+"-"+now.getDate();
        // console.log(date);
        var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d %H시%i분') as created_at "+
                  "FROM image "+
                  "WHERE DATE(created_at) >= '"+date+"'";
        // console.log(sql);
        conn.query(sql, function(err, image){ //전체 이미지 목록
          if(err){
            console.log(err);
          } else {
            // console.log(image);
            conn.query('SELECT count(id) as count FROM image WHERE DATE(created_at) >= "'+date+'"', function(err, count){ //전체 이미지 갯수
              if(err){
                console.log(err);
              } else {
                // console.log(count[0].count);
                res.render('img.ejs', {image:image, count:count[0].count});
              } //end of else
            });
          } //end of else
        });
      } else {
        res.redirect('/');
      }
    });
    app.post('/period', function(req, res){
      if(req.session.login == 'logined') {
        console.log('\n\t==== ROUTE /period ====');
        // console.log(req.body.startdate);
        // console.log(req.body.enddate);
        var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d %H시%i분') as created_at "+
                  "FROM image "+
                  "WHERE DATE(created_at) between '"+req.body.startdate+"' and '"+req.body.enddate+"'";
        // console.log(sql);
        conn.query(sql, function(err, image){ // 이미지 목록
          if(err){
            console.log(err);
          } else {
            // console.log(image);
            conn.query('SELECT count(id) as count FROM image WHERE DATE(created_at) between "'+req.body.startdate+'" and "'+req.body.enddate+'"', function(err, count){ //전체 이미지 갯수
              if(err){
                console.log(err);
              } else {
                // console.log(count[0].count);
                res.render('img.ejs', {image:image, count:count[0].count});
              } //end of else
            });
          } //end of else
        });
      } else {
        res.redirect('/');
      }
    });
    app.get('/arrange/:stand', function(req, res){
      if(req.session.login == 'logined') {
        console.log('\n\t==== ROUTE /period_img ====');
        
        var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d %H시%i분') as created_at "+
                  "FROM image "+
                  "ORDER BY "+req.params.stand+" DESC";
        // console.log(sql);
        conn.query(sql, function(err, image){ //전체 이미지 목록
          if(err){
            console.log(err);
          } else {
            // console.log(image);
            conn.query('SELECT count(id) as count FROM image', function(err, count){ //전체 이미지 갯수
              if(err){
                console.log(err);
              } else {
                // console.log(count[0].count);
                res.render('img.ejs', {image:image, count:count[0].count});
              } //end of else
            });
          } //end of else
        });
      } else {
        res.redirect('/');
      }
    });
    app.post('/update/:img_id', upload.single('img'), function(req, res){ //이미지 수정
      if(req.session.login == 'logined') {
        console.log('\n\t==== ROUTE /update_img ====');
        // console.log('existed file id : '+req.params.img_id);
        // console.log('new FILENAME : '+req.file.filename);
        var sql='SELECT name FROM image WHERE id='+req.params.img_id;
        // console.log(sql);
        conn.query(sql, function(err, name){ //이미지 이름
          if(err){
            console.log(err);
            res.redirect('/img');
          } else {
            // console.log('existed file name : '+name[0].name);
            // console.log('existed file path : '+__dirname + '/upload/' + name[0].name);
            fs.exists(__dirname + '/upload/' + name[0].name, function (exist) { 
              if(exist){
                fs.unlink(__dirname + '/upload/' + name[0].name, (err) => { //파일 삭제
                  if (err) throw err;
                  sql = "UPDATE image SET name='"+req.file.filename+"' WHERE id="+req.params.img_id;
                  // console.log(sql);
                  conn.query(sql, function(err, result){ //DB에서 파일명 수정
                    if(err){
                      console.log(err);
                      res.redirect('/img');
                    } else {
                      // console.log(result);
                      res.redirect('/img');
                    }
                  });
                });
              } else { //image file is not exist
                res.redirect('/img');
              }
            });
          }//end of else
        }); 
      } else {
        res.redirect('/');
      }
    });
    app.get('/delete/img/:img_id', function(req, res){ //이미지 삭제
      if(req.session.login == 'logined') {
        console.log('\n\t==== ROUTE /delete ====');
        // console.log('id : '+req.params.img_id);
        var sql='SELECT name FROM image WHERE id='+req.params.img_id;
        // console.log(sql);
        conn.query(sql, function(err, name){ //이미지 이름
          if(err){
            console.log(err);
            res.redirect('/img');
          } else {
            // console.log('file path : '+__dirname + '/upload/'+name[0].name);
            fs.exists(__dirname + '/upload/' + name[0].name, function (exist) { 
              if(exist){
                fs.unlink(__dirname + '/upload/' + name[0].name, (err) => { //파일 삭제
                  if (err) throw err;
                  sql = 'DELETE FROM image WHERE id='+req.params.img_id;
                  conn.query(sql, function(err, result){ //DB에서 파일명 삭제
                    if(err){
                      console.log(err);
                      res.redirect('/img');
                    } else {
                      // console.log(result);
                      res.redirect('/img');
                    }
                  });
                });
              } else { //image file is not exist
                res.redirect('/img');
              }
            });
          }//end of else
        }); 
      } else {
        res.redirect('/');
      }
       
    });
    /****push****/
    app.get('/push', function(req, res){ //푸시 알림
      if(req.session.login == 'logined') {
        console.log('\n\t==== ROUTE /push ====');
        var d = new Date();
        var month = d.getMonth()+1;
        if(month < 10) month = '0'+month;
        var date = d.getFullYear()+"-"+month+"-"+d.getDate();
        var sql = 'SELECT id, content, DATE_FORMAT(created_at,"%Y.%m.%d") as created_at FROM push';
        conn.query(sql, function(err, push){ //전체 이미지 목록
          if(err){
            console.log(err);
          } else {
            // console.log(push);
            conn.query('SELECT count(id) as count FROM push', function(err, count){ //전체 알림 목록
            if(err){
              console.log(err);
            } else {
              // console.log(count[0].count);
              res.render('push.ejs', {push:push, count:count[0].count, date:date});
            }
          });
          }//end of else
        });
      } else {
        res.redirect('/');
      }
    });
    app.post('/create', function(req, res){ //push
      if(req.session.login == 'logined') {
        console.log('\n\t==== ROUTE /create ====');
        
        // console.log(req.body);
        var sql = "INSERT INTO push (content, created_at) VALUES('"+req.body.content+"', '"+req.body.date+"');";
        console.log(sql);
        conn.query(sql, function(err, result){ //
          if(err){
            console.log(err);
            res.redirect('/push');
          } else {
            // console.log(result);
            res.redirect('/push');
          }
        });
      } else {
        res.redirect('/');
      }
    });
    app.post('/update/push/:push_id', function(req, res){ //push 수정
      if(req.session.login == 'logined') {
        console.log('\n\t==== ROUTE /update_push ====');
        var sql = "UPDATE push SET content='"+req.body.content+"' WHERE id="+req.params.push_id;
        // console.log(sql);
        conn.query(sql, function(err, result){ //DB에서 push 내용 수정
          if(err){
            console.log(err);
            res.redirect('/push');
          } else {
            // console.log(result);
            res.redirect('/push');
          }
        });
      } else {
        res.redirect('/');
      }
    });
    /****user****/
    
  /**********API**************/
    app.get('/clickup/:img_id', function(req, res){
        console.log('\n\t==== ROUTE /clickup ====');
        // console.log('img_id : '+req.params.img_id);
        var sql = "SELECT click FROM image where id="+req.params.img_id;
        console.log(sql);
        conn.query(sql, function(err, result){ //증가할 이미지 찾기
          if(err){
            console.log(err);
            res.json({
              "result" : "fail",
              "err" : err
            });
          } else {
            // console.log(result);
            var click = result[0].click + 1; 
            var sql = "UPDATE image SET click="+click+" WHERE id="+req.params.img_id;
            // console.log(sql);
            conn.query(sql, function(err, result){ //전체 이미지 목록
              if(err){
                console.log(err);
                res.json({
                  "result" : "fail",
                  "err" : err
                });
              } else {
                // console.log(result);
                res.json({
                  "result" : "success",
                  "click" : click
                });
              }
            });
          }
        });
    });
    app.get('/downup/:img_id', function(req, res){
        console.log('\n\t==== ROUTE /downup ====');
        // console.log('img_id : '+req.params.img_id);
        var sql = "SELECT down FROM image where id="+req.params.img_id;
        console.log(sql);
        conn.query(sql, function(err, result){ //증가할 이미지 찾기
          if(err){
            console.log(err);
            res.json({
              "result" : "fail",
              "err" : err
            });
          } else {
            // console.log(result);
            var down = result[0].down + 1; 
            var sql = "UPDATE image SET down="+down+" WHERE id="+req.params.img_id;
            // console.log(sql);
            conn.query(sql, function(err, result){ //전체 이미지 목록
              if(err){
                console.log(err);
                res.json({
                  "result" : "fail",
                  "err" : err
                });
              } else {
                // console.log(result);
                res.json({
                  "result" : "success",
                  "down" : down
                });
              }
            });
          }
        });
    });
    app.get('/imglist', function(req, res){
        console.log('\n\t==== ROUTE /imglist ====');
        var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d') as created_at FROM image";
        console.log(sql);
        conn.query(sql, function(err, image){ //전체 이미지 목록
          if(err){
            console.log(err);
            res.json({
              "result" : "fail",
              "err" : err
            });
          } else {
            conn.query('SELECT count(id) as count FROM image', function(err, count){ //전체 이미지 목록
              if(err){
                console.log(err);
                res.json({
                  "result" : "fail",
                  "err" : err
                });
              } else {
                res.json({
                  "result" : "success",
                  "count" : count[0].count,
                  "imglist" : image
                });
              } //end of else
            });
          } //end of else
        });
    });
    app.get('/img/:id', function(req, res){
        console.log('\n\t==== ROUTE /img/:id ====');
        var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d') as created_at FROM image WHERE id>="+req.params.id;
        console.log(sql);
        conn.query(sql, function(err, image){ //전체 이미지 목록
          if(err){
            console.log(err);
            res.json({
              "result" : "fail",
              "err" : err
            });
          } else {
            conn.query('SELECT count(id) as count FROM image WHERE id>='+req.params.id, function(err, count){ //전체 이미지 목록
              if(err){
                console.log(err);
                res.json({
                  "result" : "fail",
                  "err" : err
                });
              } else {
                res.json({
                  "result" : "success",
                  "count" : count[0].count,
                  "imglist" : image
                });
              } //end of else
            });
          }//end of else
        });
    });
    app.get('/imgAt/:date', function(req, res){
        console.log('\n\t==== ROUTE /imgAt ====');
        var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d') as created_at FROM image WHERE created_at>='"+req.params.date+"'";
        console.log(sql);
        conn.query(sql, function(err, image){ //이미지 목록
          if(err){
            console.log(err);
            res.json({
              "result" : "fail",
              "err" : err
            });
          } else {
            conn.query('SELECT count(id) as count FROM image WHERE created_at>="'+req.params.date+'"', function(err, count){ //전체 이미지 목록
              if(err){
                console.log(err);
                res.json({
                  "result" : "fail",
                  "err" : err
                });
              } else {
                res.json({
                  "result" : "success",
                  "count" : count[0].count,
                  "imglist" : image
                });
              } //end of else
            });
          }//end of else
        });
    });
    app.post('/imgPeriod', function(req, res){
      console.log('\n\t==== ROUTE /imgPeriod ====');
      // console.log(req.body.startdate);
      // console.log(req.body.enddate);
      var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d') as created_at "+
                "FROM image "+
                "WHERE DATE(created_at) between '"+req.body.startdate+"' and '"+req.body.enddate+"'";
      // console.log(sql);
      conn.query(sql, function(err, image){ // 이미지 목록
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          // console.log(image);
          conn.query('SELECT count(id) as count FROM image WHERE DATE(created_at) between "'+req.body.startdate+'" and "'+req.body.enddate+'"', function(err, count){ //전체 이미지 갯수
            if(err){
              console.log(err);
              res.json({
                "result" : "fail",
                "err" : err
              });
            } else {
              // console.log(count[0].count);
              res.json({
                "result" : "success",
                "count" : count[0].count,
                "imglist" : image
              });
            } //end of else
          });
        } //end of else
      });
    });
    app.get('/pushlist', function(req, res){ //푸시 알림
        console.log('\n\t==== ROUTE /pushlist ====');
  
        var sql = 'SELECT id, content, DATE_FORMAT(created_at,"%Y.%m.%d") as created_at FROM push';
        conn.query(sql, function(err, push){ //전체 푸시 목록
          if(err){
            console.log(err);
            res.json({
              "result" : "fail",
              "err" : err
            });
          } else {
            // console.log(push);
            conn.query('SELECT count(id) as count FROM push', function(err, count){ //전체 알림 목록
            if(err){
              console.log(err);
              res.json({
                "result" : "fail",
                "err" : err
              });
            } else {
              // console.log(count[0].count);
              res.json({
                "result" : "success",
                "count" : count[0].count,
                "pushlist" : push
              });
            }
          });
          }//end of else
        });
    });
    
    /****user****/ //-createUser, loginUser
    app.post('/createUser', function(req, res){
      console.log('\n\t==== ROUTE /createUser ====');
      
      var created_at = getDatetime();
      var device = req.body.device;
      var account_type = req.body.account_type;
      var account_id = req.body.account_id;
      var email = req.body.email;
      var gender = req.body.gender;
      var age = req.body.age;
      var push_time = (req.body.push_time == undefined)?(getDatetime()):(req.body.push_time);
      
      console.log('created_at : '+created_at); console.log('device : '+device);
      console.log('account_type : '+account_type); console.log('account_id : '+account_id);
      console.log('email : '+email); console.log('gender : '+gender);
      console.log('age : '+age); console.log('push_time : '+push_time);
      
      var sql = 'INSERT INTO user(device, account_type, account_id, email, gender, age) VALUES("?","?",?,"?","?",?)';
      conn.query(sql, [device, account_type, account_id, email, gender, age], function(err, user){ //전체 푸시 목록
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          todayTotal('user', function(ok, result){
            if(ok){
              res.json({
                "result" : "success",
                "return" : user
              });
            } else errControll(result, res);
          });
          
        }//end of else
      });
    });
    app.get('/findUser/:userId', function(req, res){
      console.log('\n\t==== ROUTE /findUser ====');
      var id = req.params.userId;
      
      var sql = 'SELECT * FROM user WHERE id = ?';
      conn.query(sql, id, function(err, user){ //특정 유저 검색
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          res.json({
            "result" : "success",
            "return" : user
          });
        }//end of else
      });
    });
    app.get('/deleteUser/:userId', function(req, res){
      console.log('\n\t==== ROUTE /deleteUser ====');
      var id = req.params.userId;
      
      var sql = 'DELETE FROM user WHERE id = ?';
      conn.query(sql, id, function(err, user){ //특정 유저 삭제
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          res.json({
            "result" : "success",
            "return" : user
          });
        }//end of else
      });
    });
    app.get('/loginUser/:userId', function(req, res){
      console.log('\n\t==== ROUTE /loginUser ====');
      var id = req.params.userId;
      
      var sql = 'UPDATE user SET logined_at = "'+getDatetime()+'" WHERE id = ?';
      conn.query(sql, id, function(err, user){ //특정 유저 로그인 기록
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          res.json({
            "result" : "success",
            "return" : user
          });
        }//end of else
      });
    });
    app.post('/pushtimeUser', function(req, res){
      console.log('\n\t==== ROUTE /pushtimeUser ====');
      var id = req.body.userId;
      var pushtime = req.body.push_time;
      
      var sql = 'UPDATE user SET pushtimeUser = "?" WHERE id = ?';
      conn.query(sql, [pushtime, id], function(err, user){ //특정 유저 push알림 시간 기록
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          res.json({
            "result" : "success",
            "return" : user
          });
        }//end of else
      });
    });
    app.get('/visitUser/:userId', function(req, res){
      console.log('\n\t==== ROUTE /visitUser ====');
      var id = req.params.userId;
      
      var sql = 'SELECT visit FROM user WHERE id = ?';
      conn.query(sql, id, function(err, visit){ //특정 유저 로그인 기록
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          sql = 'UPDATE user SET visit = ? WHERE id = ?'
          conn.query(sql, [visit[0]['visit']+1, id], function(err, result){
            if(err){
              console.log(err);
              res.json({
                "result" : "fail",
                "err" : err
              });
            } else {
              todayTotal('visit', function(ok, result){
                if(ok){
                  res.json({
                    "result" : "success",
                    "return" : result
                  });
                } else errControll(result, res);
              });
            }
          });
        }//end of else
      });
    });
    app.get('/downUser/:userId', function(req, res){
      console.log('\n\t==== ROUTE /downUser ====');
      var id = req.params.userId;
      
      var sql = 'select down FROM user WHERE id = ?';
      conn.query(sql, id, function(err, down){ //특정 유저 다운로드 수 검색
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          sql = 'UPDATE user SET down = ? where id = ?'
          conn.query(sql, [down[0]['down']+1, id], function(err, result){
            if(err){
              console.log(err);
              res.json({
                "result" : "fail",
                "err" : err
              });
            } else {
              todayTotal('down', function(ok, result){
                if(ok){
                  res.json({
                  "result" : "success",
                  "return" : result
                  });
                } else errControll(result, res);
              });
            }
          });
        }//end of else
      });
    });
    app.get('/starUser/:userId', function(req, res){
      console.log('\n\t==== ROUTE /starUser ====');
      var id = req.params.userId;
      
      var sql = 'select star FROM user WHERE id = ?';
      conn.query(sql, id, function(err, star){ //특정 유저 star 검색
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          sql = 'UPDATE user SET star = ? where id = ?';
          conn.query(sql, [star[0]['star']-3, id], function(err, result){
            if(err){
              console.log(err);
              res.json({
                "result" : "fail",
                "err" : err
              });
            } else {
              res.json({
              "result" : "success",
              "return" : result
              });
            }
          });
        }//end of else
      });
    });
    app.get('/adviewUser/:userId', function(req, res){
      console.log('\n\t==== ROUTE /adviewUser ====');
      var id = req.params.userId;
      
      var sql = 'select star, ADview FROM user WHERE id = ?';
      conn.query(sql, id, function(err, result){ //특정 유저 star, ADview 검색
        if(err){
          console.log(err);
          res.json({
            "result" : "fail",
            "err" : err
          });
        } else {
          var star = result[0]['star'];
          var adview = result[0]['ADview'];
          sql = 'UPDATE user SET star = ?, ADview = ? where id = ?';
          conn.query(sql, [star+5, adview+1, id], function(err, result){
            if(err){
              console.log(err);
              res.json({
                "result" : "fail",
                "err" : err
              });
            } else {
              todayTotal('ADview', function(ok, result){
                if(ok){
                  res.json({
                  "result" : "success",
                  "return" : result
                  });
                } else errControll(result, res);
              });
              
            }
          });
        }//end of else
      });
    });
  
  
  function getDatetime(){
    var d = new Date();
    var month = d.getMonth()+1;
    if(month < 10) month = '0'+month;
    var date = d.getFullYear()+"-"+month+"-"+d.getDate();
    var time = d.getHours()+9;
    var min = d.getMinutes();
    if(min < 10) min = '0'+min;
    return date+' '+time+':'+min;
  };
  function getDate(){
    var d = new Date();
    var month = d.getMonth()+1;
    if(month < 10) month = '0'+month;
    var date = d.getFullYear()+"-"+month+"-"+d.getDate();
    return date;
  };
  function errControll(err, res){
    console.log(err);
    res.redirect('/main');
  }
  function todayTotal(column, callback){
    console.log('\ttodayTotal - '+column);
    var sql = 'SELECT * FROM total WHERE date ="'+getDate()+'"';
    conn.query(sql, function(err, result){
      if(err) callback(false, err); 
      else {
        // console.log('column : '+result.length);
        if(result.length == 0){ //column이 없음
          sql = 'INSERT INTO total('+column+', date) VALUES(?, "'+getDate()+'")';
          conn.query(sql, 1, function(err, result){
            if(err) callback(false, err);
            else callback(true, result);
          });
        } else { //column이 있음
          sql = 'SELECT '+column+' FROM total WHERE date = "'+getDate()+'"';
          conn.query(sql, function(err, value){
            if(err) callback(false, err);
            else {
              // console.log('value : '+value);
              // console.log('value[0] : '+value[0]);
              // console.log('value[0][column] : '+value[0][column]);
              sql = 'UPDATE total SET '+column+' = ? WHERE date = "'+getDate()+'"';
              conn.query(sql, value[0][column]+1, function(err, result){
                if(err) callback(false, err);
                else callback(true, result);
              });
            }
          });
        }
      }
    });
  }
}