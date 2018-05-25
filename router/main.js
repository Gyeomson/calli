module.exports = function(app,fs)
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
        cb(null, file.originalname);
      }
    }),
  });
  // var upload = multer({ dest: 'upload/' });

  app.get('/', function(req, res){
    console.log('== route / ==');
    res.render('index.html');
  });
  app.post('/login', function(req, res){
    console.log('== route /login ==');
    console.log(req.body.id);
    if(req.body.id == 'admin'){
      console.log(req.body.pw);
      if(req.body.pw == 'admin') { //로그인 성공
        res.redirect("/img"); //!!!!세션 추가하기
      } else { //비밀번호 틀림
        res.redirect('/');
      }
    } else { //아이디 틀림
      res.redirect('/');
    }
  });
  
  app.get('/banner', function(req, res){
    console.log('== route /banner ==');
    res.render('banner.ejs');
  });
  app.post('/upload', upload.single('img'), function(req, res){ //파일 업로드
    console.log('== route /upload ==');
    console.log('req.file : '+req.file.filename);
    var sql = "INSERT INTO image (name) VALUES('"+req.file.filename+"');";
    console.log(sql);
    conn.query(sql, function(err, result){ //전체 이미지 목록
      if(err){
        console.log(err);
        res.redirect('/banner');
      } else {
        console.log(result);
        console.log('end');
        res.redirect('/banner');
      }
    });
    // res.redirect('/banner')
  });
  
  app.get('/img', function(req, res){
    console.log('== route /img ==');
    var sql = 'SELECT * FROM image';
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
        }
      });
        // res.render('img.ejs', {image:image});
      }//end of else
    });
  });
  app.put('/img/:img_id', function(req, res){ //이미지 수정
    console.log(req.params.img_id);
    res.redirect('/img');
  });
  app.delete('/img/img_id', function(req, res){ //이미지 삭제
    console.log(req.params.img_id);
    res.redirect('/img');
  });
  
  app.get('/push', function(req, res){ //푸시 알림
    console.log('== route /push ==');
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