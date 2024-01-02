const { idxAgreement, idxPerson } = require('../src/elastic');

module.exports = function () {
  try{
  idxAgreement.createIndexAndMapping();
  }catch(error){
    if (error instanceof ConnectionError) {
      // Implement retry logic or handle the error appropriately
      console.error('Connection error:', error.message);
    } else {
      // Handle other types of errors
      console.error('Other error:', error.message);
    }  
  }
};
