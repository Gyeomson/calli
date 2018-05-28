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
        cb(null, 'upload/');
      },
      filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + file.originalname);
      }
    }),
  });
  
  const fs = require("fs");
  // var upload = multer({ dest: 'upload/' });

  app.get('/', function(req, res){
    console.log('\n== route / ==');
    console.log(req.session);
    res.render('index.ejs');
  });
  app.post('/login', function(req, res){
    console.log('== route /login ==');
    console.log('req.body.id : '+req.body.id);
    if(req.body.id == 'admin'){
      console.log('req.body.pw : '+req.body.pw);
      if(req.body.pw == 'admin') { //로그인 성공
        req.session.login = 'logined';
        console.log('req.session.login : '+req.session.login);
        res.redirect("/img"); //!!!!세션 추가하기
      } else { //비밀번호 틀림
        res.redirect('/');
      }
    } else { //아이디 틀림
      res.redirect('/');
    }
  });
  app.get('/logout', function(req, res){
    console.log('== route /logout ==');
    req.session.destroy(function(err){
      if(err) res.redirect('/');
      console.log(req.session);
      res.redirect('/');
    });
  });
  
  app.get('/banner', function(req, res){
    if(req.session.login == 'logined'){
      console.log('\n== route /banner ==');
      var d = new Date();
      var month = d.getMonth()+1;
      if(month < 10) month = '0'+month;
      var date = d.getFullYear()+"-"+month+"-"+d.getDate();
      var time = d.getHours()+9;
      var min = d.getMinutes();
      if(min < 10) min = '0'+min;
      console.log(date+' '+time+'시 '+min+'분');
      res.render('banner.ejs', {date:date, time:time, min:min});
    } else {
      res.redirect('/');
    }
  });
  app.post('/upload', upload.single('img'), function(req, res){ //파일 업로드
    if(req.session.login == 'logined') {
      console.log('\n== route /upload ==');
      var date=req.body.date+' '+req.body.time+':'+req.body.min;
      console.log('date : '+date);
      console.log('req.file : '+req.file.filename);
      var sql = "INSERT INTO image (name, created_at) VALUES('"+req.file.filename+"', '"+date+"');";
      console.log(sql);
      conn.query(sql, function(err, result){ //전체 이미지 목록
        if(err){
          console.log(err);
          res.redirect('/banner');
        } else {
          console.log(result);
          console.log('end');
          res.redirect('/img');
        }
      });
    } else {
      res.redirect('/');
    }
    
  });
  
  app.get('/img', function(req, res){
    if(req.session.login == 'logined') {
      console.log('\n== route /img ==');
      var sql = "SELECT id, name, click, down, DATE_FORMAT(created_at,'%Y.%m.%d %H시%i분') as created_at FROM image";
      console.log(sql);
      conn.query(sql, function(err, image){ //전체 이미지 목록
        if(err){
          console.log(err);
        } else {
          console.log(image);
          conn.query('SELECT count(id) as count FROM image', function(err, count){ //전체 이미지 목록
            if(err){
              console.log(err);
            } else {
              console.log(count[0].count);
              res.render('img.ejs', {image:image, count:count[0].count});
            } //end of else
          });
        } //end of else
      });
    } else {
      res.redirect('/');
    }
    
  });
  app.get('/update/img/:img_id', function(req, res){ //!!!!이미지 수정
    console.log('\n== route /delete ==');
    console.log('id : '+req.params.img_id);
    var sql='SELECT name FROM image WHERE id='+req.params.img_id;
    console.log(sql);
    conn.query(sql, function(err, name){ //이미지 이름
      if(err){
        console.log(err);
        res.redirect('/img');
      } else {
        console.log('name : '+name[0].name);
        
        
      }
    }); 
    
  });
  
  app.get('/delete/img/:img_id', function(req, res){ //이미지 삭제
    console.log('\n== route /delete ==');
    console.log('id : '+req.params.img_id);
    var sql='SELECT name FROM image WHERE id='+req.params.img_id;
    console.log(sql);
    conn.query(sql, function(err, name){ //이미지 이름
      if(err){
        console.log(err);
        res.redirect('/img');
      } else {
        console.log('name : '+name[0].name);
        console.log('file path : '+'/upload/'+name[0].name);
        fs.exists('/upload/'+name[0].name, function (exists) { 
          console.log(exists ? "it's there" : "no exists!"); 
          res.redirect('/img');
          // fs.unlink('/upload/'+name[0].name, (err) => {
          //   if (err) throw err;
          //   console.log('successfully deleted');
            
          //   //여기서 db 지우기
          //   sql = 'DELETE FROM image WHERE id='+req.params.img_id;
          //   conn.query(sql, function(err, result){ //전체 이미지 목록
          //     if(err){
          //       console.log(err);
          //       res.redirect('/img');
          //     } else {
          //       console.log(result);
          //       res.redirect('/img');
          //     }
          //   });
            
          // });
          
        });
        
      }
    });  
    
    // res.redirect('/img');
  });
  
  app.get('/push', function(req, res){ //푸시 알림
    console.log('\n== route /push ==');
    var sql = 'SELECT * FROM push';
    conn.query(sql, function(err, push){ //전체 이미지 목록
      if(err){
        console.log(err);
      } else {
        console.log(push);
        conn.query('SELECT count(id) as count FROM push', function(err, count){ //전체 이미지 목록
        if(err){
          console.log(err);
        } else {
          console.log(count[0].count);
          res.render('push.ejs', {push:push, count:count[0].count});
        }
      });
      }//end of else
    });
  });
}