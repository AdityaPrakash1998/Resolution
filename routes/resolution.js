let express= require('express');
let router=express.Router();
var mongodb=require('mongodb');
var bodyParser=require('body-parser');


//ANOTHER route to add the entries
router.get('/addResolutions',function(req,res)
{

  res.render("addResolutions",
{
  title:'Want to add resolutions?\n '
}
);
});

//POST request from Add Resolution form
router.post('/addResolutions',function(req,res)
{
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //Validation errors
    let errors=req.validationErrors();

    if(errors){
      res.render('addResolutions',{
        title:'Want to add resolutions?',
        errors:errors
      });
    }
    else {
      var MongoClient=mongodb.MongoClient;
      var url= "mongodb://localhost:27017/resolutions";
      MongoClient.connect(url,function(err,db)
    {
      if(err)
        console.log(err);
        else {
          console.log('connected to server');

          var collection=db.collection('myResolutions');

          var resolution={
            "title": req.body.title,
            "body": req.body.body
          };
          collection.insert([resolution],function(err,result)
        {
          if(err)
            res.send("Couldn't save resolution");
            else {
              console.log("saved");
              req.flash('success','Your resolution was saved');
              res.redirect("/");
            }
        });
        }
        db.close();
    });

    }


});

//Individual resolution route
router.get('/resolution/:id',function(req,res)
{
    var MongoCliet=mongodb.MongoClient;
    var url= "mongodb://localhost:27017/resolutions";
    MongoCliet.connect(url,function(err,db)
  {
    if(err) res.send("Error connecting to database");
    else {
      var collection=db.collection('myResolutions');
      var ObjectId = mongodb.ObjectID;
      collection.findOne({_id:new ObjectId(req.params.id)},function(err,result)
      {
        if(err) res.send(err);
        else {
          res.render("individualarticle",{
            resolution:result
          });
        }
      });
    }
      db.close();
  });

});

//Edit-form individual resolutions
router.get('/edit/:id',function(req,res)
{
  var MongoCliet=mongodb.MongoClient;
  var url= "mongodb://localhost:27017/resolutions";
  MongoCliet.connect(url,function(err,db)
{
  if(err) console.log(err);
  else {
    var collection=db.collection('myResolutions');
    var ObjectId=mongodb.ObjectID;
    collection.findOne({_id:new ObjectId(req.params.id)},function(err,result){
      if(err) console.log(err);
      else {
        res.render('edit',{
        resolution:result
        });
      }
    });
    db.close();
  }
});

});

//Edit-form POST request route
router.post('/edit/:id',function(req,res)
{
  var MongoCliet=mongodb.MongoClient;
  var url= "mongodb://localhost:27017/resolutions";
  MongoCliet.connect(url,function(err,db)
{
  if(err) console.log(err);
  else {
    var collection=db.collection('myResolutions');
    var resolution={
      title:req.body.title,
      body:req.body.body
    };
    var ObjectId = mongodb.ObjectID;
    collection.update({_id:new ObjectId(req.params.id)},resolution);
    req.flash('success','Your resolution was successfully editted');
    res.redirect('/');
  }
  db.close();
});

});


//DELETING request handling
router.delete('/resolution/:id',function(req,res)
{
  var MongoCliet=mongodb.MongoClient;
  var url= "mongodb://localhost:27017/resolutions";
  MongoCliet.connect(url,function(err,db)
{
  if(err) console.log(err);
  else {
    var collection=db.collection('myResolutions');
    var ObjectId = mongodb.ObjectID;
    collection.deleteOne({_id:new ObjectId(req.params.id)},function(err)
  {
    if(err) console.log(err);
    else {
      req.flash('danger','Deleted one record');
      res.send();
    }
  });
  }
  db.close();
});

});

module.exports=router;
