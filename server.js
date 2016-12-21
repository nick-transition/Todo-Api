var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
  var todoId = parseInt(req.params.id,10);
  var match = _.findWhere(todos,{id:todoId});
  return match ? res.json(match) : res.status(404).send();
});

// POST /todos
app.post('/todos',function(req,res){
  var body = _.pick(req.body,'description','completed');

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }
  body.description = body.description.trim()
  body.id = todoNextId++;

  todos.push(body)

  res.json(body)
});

//Delete  /todos/:id

app.delete('/todos/:id',function (req,res) {
  var todoId = parseInt(req.params.id,10);
  var match = _.findWhere(todos,{id:todoId});
  todos = match ? _.without(todos,match) : todos;
  return match ? res.json(match) : res.status(404).json("Error: No todo found with that id");
});

// PUT /todos/:id

app.put('todos/:id', function (req,res) {
  console.log("wtf");
  var todoId = parseInt(req.params.id,10);
  var match = _.findWhere(todos,{id:todoId});
  var body = _.pick(req.body,'description','completed');
  var validAttributes = {};

  if(!match){

    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  }else if (body.hasOwnProperty('completed')){
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && body.description.trim().length > 0 && _.isString(body.completed)){
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')){
    return res.status(400).send();
  }

  _.extend(match,validAttributes);

  res.json(match);
});

app.listen(PORT,function () {
  console.log('Express server started at: http://localhost:'+PORT);
});
