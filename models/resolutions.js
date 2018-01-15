const mongoose=require('mongoose');

//Resolutions Schema
let resolutionSchema=mongoose.Schema(
  {
    title:
    {
      type:String,
      required:true
    },
    body:
    {
      type:String,
      required:true
    }
  }
);

let Resolution = module.exports=mongoose.model('resolution',resolutionSchema);
