var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
  id: 1,
  description: 'Fire ted',
  completed: false
}, {
  id: 2,
  description: 'Jump rope',
  completed: false
}, {
  id: 3,
  description: 'Eat dinner',
  completed: true
}];

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

app.listen(PORT,function () {
  console.log('Express server started at: http://localhost:'+PORT);
});
