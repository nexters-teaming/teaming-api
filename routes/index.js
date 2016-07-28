var route = require('./route');

module.exports = function(app){
  // If need auth or routing extend
  // TODO do something

  app.use(route());
};
