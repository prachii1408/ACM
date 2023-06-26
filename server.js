const express=require ("express");
const collection=require("./mongo");
const urlData=require("./mongo2");
const cors=require("cors");
const shortId = require('shortid');
const path = require("path");
const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static(path.join(__dirname,"build")));



app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/short", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});




app.post("/",async(req,res)=>{
  const {email,pass}=req.body;
  try{
    const check=await collection.findOne({email:email})
    if(check){
        if(check.password==pass){
            res.json("exist");
        }
        else{
            
            res.json("Incorrect");
        }
        
    }
    else{
        res.json("Not exist");
    }
  }
  catch(e){
    console.log(e);
    res.json("not found");
  }
})

app.post("/register",async(req,res)=>{
    
    const data={
        email:req.body.email,
        password:req.body.pass,
        name:req.body.name
    }
    try{
      const check=await collection.findOne({email:data.email})
      if(check){
          res.json("exist");
      }
      else{
          res.json("Not exist");
          await collection.insertMany([data]);
      }
    }
    catch(e){
      console.log(e);
      res.json("not found");
    }
  })
  

  app.post("/home",async(req,res)=>{
    
    const data={
        full:req.body.url,
        short:req.body.shortenLink,
        description:req.body.desc
    }
    await urlData.insertMany([data]);
    res.json("ok");
    
  })
  

  app.get("/home",async(req,res)=>{
    const answer=await urlData.find();
    res.json(answer);
  })
  app.post("/search",async(req,res)=>{


    try {
        
        const result = await urlData.aggregate([
            {
                '$search': {
                    'index': 'default2',
                    'text': {
                        'query': req.body.url == '' ? '' : req.body.url,
                        'path': {
                            'wildcard': '*'
                        }
                    }
                }
            }
        ])
        
        res.json(result);
       
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
  })
 

  

  

  app.listen(3000,()=>{
    console.log("port is runnung");
  })
