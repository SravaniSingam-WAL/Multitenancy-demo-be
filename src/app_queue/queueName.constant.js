const _ = require('lodash');

const queueNames = {
    addition : 'Addition_',
    subtraction: 'Subtraction_',
    multiplication: 'Multiplication_'
};

_.forEach(Object.keys(queueNames), (key) => {
    queueNames[key] = queueNames[key] + 'development';
  });
  
  module.exports = queueNames;
  
  