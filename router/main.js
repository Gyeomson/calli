 module.exports = function(app)
{
    app.get('/', function(req, res){
      res.render('index.html');
    });
    app.post('/login', function(rea, res){
      
    });
    app.get('/banner', function(req, res){
      res.render('banner.html');
    });
    app.get('/img', function(req, res){
      res.render('img.html');
    });
    app.get('/push', function(req, res){
      res.render('push.html');
    });
}