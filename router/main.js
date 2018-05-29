module.exports = function(app)
{
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    // password : '111111',
    database : 'calli'
  });
  conn.connect();
  
  var multer = require('multer');
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'router/upload/');
      },
      filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + file.originalname);
      }
    }),
  });
  const fs = require("fs");

  app.get('/', function(req, res){
    console.log('\n\t==== ROUTE / ====');
    // console.log(req.session);
    res.render('index.ejs');
  });
  app.post('/login', function(req, res){
    console.log('\n\t==== ROUTE /login ====');
    // console.log('req.body.id : '+req.body.id);
    if(req.body.id == 'admin'){
      // console.log('req.body.pw : '+req.body.pw);
      if(req.body.pw == 'admin') { //로그인 성공
        req.session.login = 'logined';
        // console.log('req.session.login : '+req.session.login);
        res.redirect("/img"); //!!!!세션 추가하기
      } else { //비밀번호 틀림
        res.redirect('/');
      }
    } else { //아이디 틀림
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
  
  app.get('/banner', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n\t==== ROUTE /banner ====');
      var d = new Date();
      var month = d.getMonth()+1;
      if(month < 10) month = '0'+month;
      var date = d.getFullYear()+"-"+month+"-"+d.getDate();
      var time = d.getHours()+9;
      var min = d.getMinutes();
      if(min < 10) min = '0'+min;
      // console.log(date+' '+time+'시 '+min+'분');
      res.render('banner.ejs', {date:date, time:time, min:min});
    } else {
      res.redirect('/');
    }
  });
  app.post('/upload', upload.single('img'), function(req, res){ //파일 업로드
    if(req.session.login == 'logined') {
      console.log('\n\t==== ROUTE /upload ====');
      var date=req.body.date+' '+req.body.time+':'+req.body.min;
      // console.log('date : '+date);
      // console.log('req.file : '+req.file.filename);
      var sql = "INSERT INTO image (name, created_at) VALUES('"+req.file.filename+"', '"+date+"');";
      // console.log(sql);
      conn.query(sql, function(err, result){ //전체 이미지 목록
        if(err){
          console.log(err);
          res.redirect('/banner');
        } else {
          // console.log(result);
          res.redirect('/img');
        }
      });
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/img', function(req, res){
    if(req.session.login == 'logined') {
      console.log('\n\t==== ROUTE /img ====');
      var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d %H시%i분') as created_at FROM image";
      // console.log(sql);
      conn.query(sql, function(err, image){ //전체 이미지 목록
        if(err){
          console.log(err);
        } else {
          // console.log(image);
          conn.query('SELECT count(id) as count FROM image', function(err, count){ //전체 이미지 목록
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
  app.get('/show/:file_name', function(req, res){
    if(req.session.login == 'logined') {
      console.log('\n\t==== ROUTE /show_file ====');
      res.sendFile(__dirname + '/upload/' + req.params.file_name);
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/update/img/:img_id', function(req, res){ //!!!!이미지 수정
    console.log('\n\t==== ROUTE /update_img ====');
    console.log('id : '+req.params.img_id);
    var sql='SELECT name FROM image WHERE id='+req.params.img_id;
    console.log(sql);
    conn.query(sql, function(err, name){ //이미지 이름
      if(err){
        console.log(err);
        res.redirect('/img');
      } else {
        console.log('name : '+name[0].name);
        console.log('file path : '+__dirname + '/upload/' + name[0].name);
        
        //!!!!파일 수정
        res.redirect('/img');
      }
    }); 
    
  });
  
  app.get('/delete/img/:img_id', function(req, res){ //이미지 삭제
    console.log('\n\t==== ROUTE /delete ====');
    // console.log('id : '+req.params.img_id);
    var sql='SELECT name FROM image WHERE id='+req.params.img_id;
    console.log(sql);
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
  });
  
  app.get('/push', function(req, res){ //푸시 알림
    console.log('\n\t==== ROUTE /push ====');
    var sql = 'SELECT * FROM push';
    conn.query(sql, function(err, push){ //전체 이미지 목록
      if(err){
        console.log(err);
      } else {
        // console.log(push);
        conn.query('SELECT count(id) as count FROM push', function(err, count){ //전체 이미지 목록
        if(err){
          console.log(err);
        } else {
          // console.log(count[0].count);
          res.render('push.ejs', {push:push, count:count[0].count});
        }
      });
      }//end of else
    });
  });
  
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
          console.log(result);
          var click = result[0].click + 1; 
          var sql = "UPDATE image SET click="+click+" WHERE id="+req.params.img_id;
          console.log(sql);
          conn.query(sql, function(err, result){ //전체 이미지 목록
            if(err){
              console.log(err);
              res.json({
                "result" : "fail",
                "err" : err
              });
            } else {
              console.log(result);
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
          console.log(result);
          var down = result[0].down + 1; 
          var sql = "UPDATE image SET down="+down+" WHERE id="+req.params.img_id;
          console.log(sql);
          conn.query(sql, function(err, result){ //전체 이미지 목록
            if(err){
              console.log(err);
              res.json({
                "result" : "fail",
                "err" : err
              });
            } else {
              console.log(result);
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
      console.log('\n\t==== ROUTE /img ====');
      var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d %H시%i분') as created_at FROM image";
      // console.log(sql);
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
}