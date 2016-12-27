var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')

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
  var queryParams = req.query;
  var where = {};

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    where.completed = true;
  }else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    where.completed = false;
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length>0) {
    where.description = {
      $like: '%'+queryParams.q+'%'
    }
  }

  db.todo.findAll({where:where}).then(function(todos) {
    res.json(todos)
  }, function(e) {
    res.status(500).send();
  })
});

//Get /todos/:id
app.get('/todos/:id',function(req,res){
  var todoId = parseInt(req.params.id,10);
  db.todo.findById(todoId).then(function(todo) {
    return todo ? res.json(todo.toJSON()):res.status(404).send();
  }, function(e) {
    res.status(500).send();
  });
});

// POST /todos
app.post('/todos',function(req,res){
  var body = _.pick(req.body,'description','completed');

  db.todo.create(body).then(function(todo){
    return res.json(todo.toJSON());
  }, function (e) {
    res.status(400).json(e)
  })

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

db.sequelize.sync().then(function() {
  app.listen(PORT,function () {
    console.log('Express server started at: http://localhost:'+PORT);
  });
})
