
function getIndexName(tenantId){
    let indexName = ''
    console.log(tenantId)
    switch(tenantId){
      case '1':
        indexName='tenant-one-agreement'
        break
      case '2':
        indexName='tenant-two-agreement'
        break
        case '1':
          indexName='tenant-three-agreement'
          break
        case '2':
          indexName='tenant-four-agreement'
          break
        case '1':
          indexName='tenant-five-agreement'
          break      
      }
    return indexName
  }

  module.exports = {
    getIndexName
  }