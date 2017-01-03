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
  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function(affectedRows){
    return affectedRows === 0 ? res.status(404).json({"Error": "No todo found with that id"}) : res.status(204).send();
  }, function(){
    res.status(500).send();
  })

});

// PUT /todos/:id

app.put('/todos/:id', function (req,res) {
  var todoId = parseInt(req.params.id,10);
  var body = _.pick(req.body,'description','completed');
  var attributes = {};

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }

  if (body.hasOwnProperty('description')){
    attributes.description = body.description;
  }

  db.todo.findById(todoId).then(function(todo){
    if(todo){
      return todo.update(attributes).then(function(todo){
        res.json(todo.toJSON());
      },function(e) {
        res.status(400).json(e)
      });
    } else {
      return res.status(404).send();
    }
  }, function() {
    res.status(500).send();
  });
});

app.post('/users',function(req,res) {
  var body = _.pick(req.body,'email','password');

  db.user.create(body).then(function(user){
    return res.json(user.toPublicJSON());
  }, function (e) {
    res.status(400).json(e)
  })

});

db.sequelize.sync().then(function() {
  app.listen(PORT,function () {
    console.log('Express server started at: http://localhost:'+PORT);
  });
})
