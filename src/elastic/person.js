const esClient = require('../../config/elastic-config')
const _ = require('lodash')

function initMapping (indexName) {
    return esClient.indices.putMapping({
        index: indexName,
        body: {
            properties: {
                id: {
                    type: 'long'
                },
                onePortalId: {
                    type: 'text',
                    fields: {
                        keyword: {
                            type: 'keyword'
                        }
                    }
                },
                prefix: {
                    type: 'text'
                },
                firstName: {
                    type: 'text'
                },
                middleName: {
                    type: 'text'
                },
                lastName: {
                    type: 'text'
                },
                phoneNumber: {
                    type: 'text'
                }
            }
        }
    })
}

async function createIndexAndMapping () {
    const indexes = ['tenant-one-person','tenant-two-person']
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

async function saveDoc (person, options) {
    let ssnLastFour = (person.personVerificationDetails) ? person.personVerificationDetails.ssnLastFour : null
    const body = {
        id: person.id,
        prefix: person.prefix,
        firstName: person.firstName,
        middleName: person.middleName,
        lastName: person.lastName,
        phoneNumber: person.phoneNumber,
        secondaryPhoneNumber: person.secondaryPhoneNumber,
        email: person.email,
        dateOfBirth: _.get(person, 'dateOfBirth', null),
        isVerified: person.isVerified,
        aka: person.aka,
        isHistorical: person.isHistorical ? person.isHistorical : false,
        ssnLastFour: person.ssnLastFour ? person.ssnLastFour : ssnLastFour,
        createdAt: person.createdAt,
        isAlive: person.isAlive
    }

    const verifiedPerson = await person.getPersonVerificationDetails({ transaction: options.transaction })
    const addressPlace = await person.getAddressPlace({ transaction: options.transaction })
    const deathDetails = await person.getDeathDetails({ transaction: options.transaction })
    if (addressPlace) {
        const address = await addressPlace.getAddress({ transaction: options.transaction })
        if (address) {
            body.address = {
                id: _.get(addressPlace, 'id', null),
                line1: _.get(address, 'line1', ''),
                line2: _.get(address, 'line2', ''),
                city: _.get(address, 'city', null),
                state: _.get(address, 'state', null),
                county: _.get(address, 'county', null),
                country: _.get(address, 'country', null),
                zipcode: _.get(address, 'zipcode', null)
            }
            body.fullAddress = `${address.line1} ${address.line2} ${address.city} ${address.state} ${address.county} ${address.country} ${address.zipcode}`
        }
    }
    body.onePortalId = _.get(verifiedPerson, 'onePortalId', null)
    body.dateOfDeath = _.get(deathDetails, 'dateOfDeath', null)
    const params = {
        index: indexName,
        id: person.id,
        body: body
    }

    if (esClient._refreshIndex) {
        params.refresh = esClient._refreshIndex
    }

    return esClient.index(params)
}

function deleteDoc (person, options) {
    esClient.delete({
        index: indexName,
        id: person.id
    })
}

async function search (match) {
    try {
        const searchResults = await esClient.search({
            index: indexName,
            body: {
                query: {
                    bool: {
                        must: {
                            match: match
                        }
                    }
                }
            }
        })
        return {
            results: searchResults.hits.hits[0]
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    createIndexAndMapping: createIndexAndMapping,
    save: saveDoc,
    delete: deleteDoc,
    client: esClient,
    search: search
}
