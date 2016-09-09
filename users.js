var bcrypt = require('bcrypt');
var environment = 'development';
var config = require('./knexfile.js')[environment];
var knex = require('knex')(config);

var users = [];

function hashPassword(password){
  return bcrypt.hashSync(password,10);
}

function findUser(username){
  return knex('users').select('users.username').where('users.username',username).first();
}

function findHashedPassword(username){
  return knex('users').select('users.password').where('users.username',username).first();
}

function authenticateUser(username, password){
  return findUser(username)
  .then(function(userData){
    if(!userData){
      return false;
    }
    return findHashedPassword(username)
    .then(function(hashedPassword){
      hashedPassword = hashedPassword.password;
      return bcrypt.compareSync(password, hashedPassword);
    });
  });
}

function addUser(username,password){
  if(!username || !password){
    return false;
  }
  return findUser(username)
  .then(function(data){
    if(data.length){
      return false;
    }
    return knex('users').insert({username: username, password: hashPassword(password)});
  })
  .catch(function(err){
    return err;
  });
}

module.exports = {
    find: findUser,
    authenticate: authenticateUser,
    add: addUser
};
