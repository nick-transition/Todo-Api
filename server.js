var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json())

app.get('/',function(req,res){
  res.send('Todo API Root');
});

// Get /todos
app.get('/todos',function(req,res){
  res.json(todos);
});

//Get /todos/:id
app.get('/todos/:id',function(req,res){
  var match = todos.filter(function(a){
    return a.id===parseInt(req.params.id,10);
  })[0];

  if(match){
    res.json(match)
  }else{
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos',function(req,res){
  var body = req.body;
  body.id = todoNextId++;
  todos.push(body)
  res.json(body)
});

app.listen(PORT,function () {
  console.log('Express server started at: http://localhost:'+PORT);
});
