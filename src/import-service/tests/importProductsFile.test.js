/**
 * @jest-environment node
 */

const AWSMock = require('aws-sdk-mock')
const importProductsFile = require('../handlers/importProductsFile')

describe('importProductsFile', () => {

  it('should return signed url', async () => {
    AWSMock.mock('S3', 'getSignedUrl', 'https://signed_url_example.com')
    const { body: url } = await importProductsFile({
      queryStringParameters: {
        name: 'import-example.csv'
      }
    })
    expect(url).toBeDefined()
    expect(url).toEqual('https://signed_url_example.com')
  })

})
