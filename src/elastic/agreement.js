const esClient = require("../../config/elastic-config");
function initMapping(indexName) {
  return esClient.indices.putMapping({
    index: indexName,
    body: {
      properties: {
        id: {
          type: "long",
        },
        contractNumber: {
          type: "text",
        },
      },
    },
  });
}

async function createIndexAndMapping() {
  try{
  const indexes = ["tenant-one-agreement", "tenant-two-agreement", "tenant-three-agreement","tenant-four-agreement","tenant-five-agreement"];
  for (const indexName of indexes) {
    const exists = await esClient.indices.exists({
      index: indexName,
    });
    if (!exists) {
      await esClient.indices.create({
        index: indexName,
      });
    }
    initMapping(indexName);
  }
}
catch(err){
  console.log(err,'-------------error--------')
}
}

async function saveDoc(indexName, agreementData, options) {
    console.log(indexName)
  const body = {
    id: agreementData.id,
    contractNumber: agreementData.contractNumber,
  };
console.log('body to store data in es',body,'---Index Name ------',indexName)
  return esClient.index({
    index: indexName,
    id: agreementData.id,
    body: body,
  });
}

function deleteDoc(indexName, agreementData, options) {
  if (!agreementData.id) {
    return;
  }
  esClient.delete({
    index: indexName,
    id: agreementData.id,
  });
}

module.exports = {
  createIndexAndMapping: createIndexAndMapping,
  save: saveDoc,
  delete: deleteDoc,
  client: esClient,
};
