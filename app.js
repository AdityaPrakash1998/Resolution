const express=require('express');
const path=require('path');
var mongodb=require('mongodb');
var bodyParser=require('body-parser');
let validator=require('express-validator');
let flash=require('connect-flash');
let session=require('express-session');

//App initiation
const app=express();

//Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

//Express-session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Expree-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express-validator Middleware
app.use(validator({
  errorFormatter:function(param,msg,value)
  {
    var namespace=param.split('.')
    , root=namespace.shift()
    ,formParam=root;

    while(namespace.length){
      formParam+='['+namespace.shift()+']';
    }
    return{
      param:formParam,
      msg:msg,
      value:value
    }
  }

}));

//Home route
app.get('/', function(req, res)
{
  var isLogged=req.session.isLogged;
  //MongoClient
  var MongoClient=mongodb.MongoClient;
  //Databse url
  var url= "mongodb://localhost:27017/resolutions";
  //databse connection
  MongoClient.connect(url,function(err,db)
{
  if(err)
  {
    console.log("Couldn't connect to database");
  }
  else//connected to databse
  {
    console.log("connected to db");
    var collection =db.collection('myResolutions');
    collection.find({}).toArray(function(err,result)
    {
      if(err)
      {
        res.send(err);
      }
      else if(result.length)
      {
        res.render("index",{
          title:'These are your New Year Resolutions\n',
          resolutions:result,
          isLogged:isLogged
        });
      }
      else {
        res.redirect('addResolutions');
      }
      db.close();
    });
  }
});
});

let resolutionRoute=require('./routes/resolution');
let userRoute=require('./routes/users');
app.use('/',resolutionRoute);
app.use('/users',userRoute);

//Server start
app.listen(3000, () => console.log('App listening on port 3000!'));
