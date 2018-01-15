let express= require('express');
let router=express.Router();
let bcrypt=require('bcryptjs');
var mongodb=require('mongodb');
var bodyParser=require('body-parser');


router.get('/register',function(req,res)
{
  res.render('register');
});

router.post('/register',function(req,res)
{
  const name=req.body.name;
  const email=req.body.email;
  const username=req.body.username;
  const password=req.body.password;
  const password2=req.body.password2;

  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is Invalid').isEmail();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  let errors=req.validationErrors();
  if(errors)
  {
    res.render('register',{
      erros:errors
    });
  }
  else {
    let newUser={
      name:name,
      email:email,
      username:username,
      password:password
    };
    bcrypt.genSalt(10,function(err,salt)
  {
    bcrypt.hash(newUser.password,salt,function(err,hash)
  {
    if(err)
    console.log(err);
    else {
      newUser.password=hash;
      var MongoClient=mongodb.MongoClient;
      var url= "mongodb://localhost:27017/resolutions";
      MongoClient.connect(url,function(err,db)
    {
      if(err)
      console.log(err);
      else {
        var collection=db.collection('users');

        collection.insert([newUser],function(err,result)
      {
        if(err)
        res.send('Could not register user');
        else {
          console.log('Registered one user');
          req.flash('success','You are succefully Registered');
          res.redirect('/users/login');
        }
      });
      db.close();
      }
    });

    }
  });
  });
  }
});

router.get('/login',function(req,res)
{
  res.render('login');
});

router.post('/login',function(req,res,next)
{
  var username=req.body.username;
  var password=req.body.password;
  req.checkBody('username','Please enter your username').notEmpty();
  req.checkBody('password','Please enter your password').notEmpty();

  let errors=req.validationErrors();
  if(errors)
  {
    res.render('login',{
      errors:errors
    });
  }
  else {

    var MongoClient=mongodb.MongoClient;
    var url= "mongodb://localhost:27017/resolutions";
    MongoClient.connect(url,function(err,db)
  {
    if(err) console.log(err);
    else {
      var collection=db.collection('users');
      collection.findOne({username:username},function(err,user)
    {
      if(err) console.log(err);
      if(!user)
      {
        req.flash('danger','Invalid Username');
        res.redirect('/users/login');
      }
      else {
        bcrypt.compare(password,user.password,function(err,isMatch)
      {
        if(err)
        console.log(err);
        if(!isMatch){
          req.flash('danger','Wrong Password');
          res.redirect('/users/login');
        }
        else {
          req.flash('success','You are now logged in');
          req.session.isLogged=true;
          res.redirect('/');
        }
      });
      }
    });

    }
    db.close();
  });
  }

});

router.post('/logout',function(req,res)
{
  req.session.isLogged=false;
  res.redirect('/');
});

module.exports=router;
