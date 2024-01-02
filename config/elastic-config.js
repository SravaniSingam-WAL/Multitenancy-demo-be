const { Client } = require('@elastic/elasticsearch')

const elasticSearchUrl = 'http://localhost:9200/'
const esClientConfig = {
    node: elasticSearchUrl,
    log: 'error',
}

const esClient = new Client(esClientConfig)


module.exports = esClient
