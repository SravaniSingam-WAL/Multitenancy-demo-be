
const agreementModule = require('./agreement');


const idxAgreement = {
  createIndexAndMapping: agreementModule.createIndexAndMapping,
  save: agreementModule.save,
  delete: agreementModule.delete,
  client: agreementModule.client
};


module.exports = {
  idxAgreement
 };

